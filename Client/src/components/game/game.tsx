import '../../css/game.css';
import Maze from './maze';
import RightBar from './rightBar';
import LeftBar from './leftBar';
import { useEffect, useRef, useState } from 'react';
import { animal, MazeTileType, minionType, TowerType } from '../../utils/types';
import { Graph, value } from '../../utils/graph';
import { aStar, distanceConstruct, getDirection, vBFS, vDFS, vDijk } from '../../utils/path-finding-algo';
import { bubbleSortAlgo, insertionSortAlgo, mergeSortAlgo, quickSortAlgo, selectionSortAlgo } from '../../utils/sorting-algo';
import { uniqueNamesGenerator, Config, names} from 'unique-names-generator'
import socket from '../../services/socket';
import GameOver from './gameOver';
import { store } from '../../features/store';
import { useAppDispatch, useAppSelector } from '../../features/hooks';
import { addMovingMinion, addNewMinionState, finalGameStats, minionEnterTower, minionExitTower, opponentMinionMovement, removeMovingMinion, setWaitingForTile, updateCurrentMinion, updateCurrentTile, updateCurrentTower, updateGameEnded, updateGameStats, updateMazePath, updateMinion, updateTowerNumbers, updateZoomed } from '../../features/game_slice';

// TODO: Convert request animation frames to setInterval

socket.on('message', message => {console.log(message)});

export interface GameStatsType {timeRemaining: number, p1Coins: number, p2Coins: number, p1Towers: number[], p2Towers: number[], p1MinionCount: number, p2MinionCount: number};

function Game() { // TODO: Extract logic to maze class

  const {currentPlayer, roomId, mazeCompleted, waitingForTile, height, width, currentGraph, currentMinion, currentTower, gameStats, gameEnded, minions, currentTile, movingMinions, towers} = useAppSelector(state => state.game);

  const dispatch = useAppDispatch();



  useEffect(() => {
    console.log('setting maze generated');
    socket.off('maze generated');
    socket.on('maze generated', () => {
      console.log('all players ready to play')
    })
    socket.off('updateGameState');
    socket.on('updateGameState', (newGameState: GameStatsType) => {
      dispatch(updateGameStats(newGameState));
    })
    return ()=>{
      console.log('clearing waiting');
      socket.emit('clear waiting', socket.id) // TODO: Currently this prevents them from joining the game on game start
    }
  }, [])

  useEffect(() => {
    if (gameStats.timeRemaining === 0 && !gameEnded) {
      dispatch(finalGameStats());
      dispatch(updateGameEnded());
    }
  },[gameStats]);

  useEffect(() => {
    if (mazeCompleted) socket.emit('maze generated', roomId);
  }, [mazeCompleted]);

  useEffect(() => {
    socket.off('minion move');
    socket.on('minion move', (direction: {xPos: number, yPos: number, rotation: 'minionU' | 'minionR' | 'minionL' | 'minionD' | ''}, minionID: number) => {
      opponentMovement(direction, minionID)
    })
    socket.off('new minion');
    socket.on('new minion', type => {
      addNewMinion(type, currentPlayer === 'p1' ? 'p2' : 'p1');
    })
  }, [minions])

  useEffect(() => {
    socket.off('enterTower');
    socket.on('enterTower', (towerId:number, minionId:number) => {
      enterTower(towerId, (minionId), false);
    })
  }, [minions, towers]);

  const speed = 300; // TODO: Give each animal a different speed

  function addNewMinion(type: animal, player: 'p1' | 'p2') { // TODO: Extract to minion class
    const newId = Object.keys(minions).length;
    if(currentPlayer === player) {
      socket.emit('new minion', type, roomId, player);
    }
    dispatch(addNewMinionState({type, player}));
    if (currentPlayer === player) {
      dispatch(updateCurrentMinion(newId));
      dispatch(updateCurrentTower(null));
    }
  }

  function opponentMovement(direction: {xPos: number, yPos: number, rotation: 'minionU' | 'minionR' | 'minionL' | 'minionD' | '' }, minionId: number) {
    dispatch(opponentMinionMovement({direction, minionId}));
  }

  async function moveMinion(goTo: {xPos: number, yPos: number}, comeFrom: {xPos: number, yPos: number}, currentGraph: Graph, minion: false | minionType = false, showPath = true) {
    if (!minion) minion = minions[currentMinion as number] as minionType;
    let directions : false | {
      visited: value[];
      path: value[];
    };
    if (minion.pathFindingAlgo === 'bfs') {
      directions = vBFS(comeFrom.xPos + comeFrom.yPos*width, goTo.xPos + goTo.yPos*width, currentGraph);
    }
    else if (minion.pathFindingAlgo === 'dfs') {
      directions = vDFS(comeFrom.xPos + comeFrom.yPos*width, goTo.xPos + goTo.yPos*width, currentGraph);
    }
    else if (minion.pathFindingAlgo === 'dijk') {
      directions = vDijk(comeFrom.xPos + comeFrom.yPos*width, goTo.xPos + goTo.yPos*width, currentGraph)
    }
    else if (minion.pathFindingAlgo === 'a*') {
      directions = aStar(comeFrom.xPos + comeFrom.yPos*width, goTo.xPos + goTo.yPos*width, currentGraph, distanceConstruct(width))
    }
    else {
      directions = vBFS(comeFrom.xPos + comeFrom.yPos*width, goTo.xPos + goTo.yPos*width, currentGraph);
    }
    if (directions === false) return;
    const path = [...directions.path] as number[];
    const visited = [...directions.visited] as number[];

    minion = {
      ...minion,
      xPos: comeFrom.xPos,
      yPos: comeFrom.yPos,
      path: [...path],
      thoughtProcess: visited
    }

    dispatch(updateMinion({minionId: currentMinion as number, updatedMinion: minion}));
    // if (showPath) setPath(minion.path, minion.thoughtProcess, minion.id);
    showPathSlowly(path, visited, minion);
    function showPathSlowly(path: number[], thoughtProcess: number[], minion: minionType) {
      path = [...path];
      thoughtProcess = [...thoughtProcess];
      let prevStep: number;
      let showThoughtProcess: number[] = [];
      let showPath: number[] = [];
      function step(interval: number) {
        if (path.length === 0) {
          applyMovement(minion as minionType);
          return;
        };
        if (!prevStep) prevStep = interval;
        let nextThought = thoughtProcess.splice(0, Math.ceil(thoughtProcess.length/10));
        if (nextThought.length) {
          showThoughtProcess.push(...nextThought);
        } else {
          showPath.push(path.shift() as number);
        }
        if (currentMinion === minion.id) setPath(showPath, showThoughtProcess, minion.id); // TODO: get current Minion
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    function applyMovement(minion: minionType) {
      let xAdd = 0;
      let yAdd = 0;
      let previousTimeStamp: undefined | number;
      let previousDirection = minion.xPos + minion.yPos*width;
      function step(timestamp: number) {
        if (previousTimeStamp === undefined) {
          previousTimeStamp = timestamp;
        }
        let updatedMinion = minion as minionType;
        if ((previousTimeStamp as number) + speed < timestamp) {
          previousTimeStamp = timestamp
          const nextDirection = path.shift() as number;
          const direction = getDirection(previousDirection as number, nextDirection as number, width);
          socket.emit('minion move', direction, minion.id, roomId);
          xAdd += direction.xPos;
          yAdd += direction.yPos;
          previousDirection = nextDirection;
          updatedMinion = {
            ...(minion as minionType),
            yPos: (minion as minionType).yPos + yAdd,
            xPos: (minion as minionType).xPos + xAdd,
            rotation: direction.rotation
          }
          dispatch(updateMinion({minionId: minion.id, updatedMinion}));
        }
        if (path.length) requestAnimationFrame(step);
        else {
          dispatch(updateMinion({minionId: minion.id, updatedMinion: {...updatedMinion, rotation: ''}}));
          dispatch(removeMovingMinion(minion.id));
          for (let tower of towers) {
            if (tower.minion === null && tower.xPos === updatedMinion.xPos && tower.yPos === updatedMinion.yPos && tower.alignment !== updatedMinion.alignment) {
              socket.emit('enterTower', tower.id, minion.id, roomId, currentPlayer);
              enterTower(tower.id, (minion as minionType).id);
            }
          }
        }
      }
      requestAnimationFrame(step);
    }
  }

  useEffect(() => {
    setPath([], [], null);
    if (currentMinion !== null && !movingMinions.includes(currentMinion as number)) {
      dispatch(updateCurrentTile(null));
      dispatch(setWaitingForTile(true));
    } else if (currentMinion !== null) {
      const minion = minions[currentMinion as number];
      setPath(minion.path, minion.thoughtProcess, minion.id);
    } else {
      dispatch(setWaitingForTile(false));
    }
  }, [currentMinion])

  function setPath(path: number[], visited: number[], minionId: number | null) {
    if (currentMinion === minionId) {
      dispatch(updateMazePath({path, visited, minionId}));
    }
  }

  useEffect(() => { // TODO: Extract to a new file
    if (waitingForTile && currentTile !== null && currentGraph && !movingMinions.includes(currentMinion as number)) {
      dispatch(addMovingMinion(currentMinion as number));
      const minion = minions[currentMinion as number];
      moveMinion(currentTile, {xPos: minion.xPos, yPos: minion.yPos}, currentGraph);
    }
  }, [currentTile])

  async function enterTower(towerId: number, minionId: number, movedAfter = true) {

    dispatch(minionEnterTower({minionId, towerId}));
    if (currentMinion === minionId) {
      dispatch(updateCurrentMinion(null));
    };
    const minion = minions[minionId];
    const tower = towers.find(tower => tower.id === towerId) as TowerType;
    let array = [...tower.numbers];
    let animations = (
      minion.sortingAlgo === 'bubble' ? bubbleSortAlgo([...tower.numbers], minion.alignment === 'p1') :
      minion.sortingAlgo === 'insertion' ? insertionSortAlgo([...tower.numbers], minion.alignment === 'p1') :
      minion.sortingAlgo === 'selection' ? selectionSortAlgo([...tower.numbers], minion.alignment === 'p1') :
      minion.sortingAlgo === 'merge' ? mergeSortAlgo([...tower.numbers], minion.alignment === 'p1') :
      quickSortAlgo(array, minion.alignment === 'p1')
    )
    await new Promise((resolve, reject) => {
      const interval = setInterval(()=>{
        if (minion.alignment === 'p2') array.sort((a, b) => a - b);
        else array.sort((a,b) => b - a);
        dispatch(updateTowerNumbers({towerId, newNumbers: array}));
        clearInterval(interval);
        resolve(true);
      }, minion.sortingSpeed*2*(animations.length + 4)); // TODO: Check this is accurate
    })
    exitTower(towerId, minionId, movedAfter);
  }

  function exitTower(towerId: number, minionId: number, movedAfter: boolean) {
    let minion = minions[minionId];
    let tower = towers.find(tower => tower.id === towerId) as TowerType;
    if (minion.alignment === currentPlayer) {
      if (tower.alignment === 'none') {
        socket.emit('conquerTower', roomId, towerId, true, currentPlayer);
      } else {
        socket.emit('conquerTower', roomId, towerId, false, currentPlayer);
      }
    }
    dispatch(minionExitTower({minionId, towerId}));
    dispatch(addMovingMinion(currentMinion as number));
    tower = towers.find(tower => tower.id === towerId) as TowerType;
    if (movedAfter) {
      if (minion.alignment === 'p1') moveMinion({xPos:0, yPos:3}, {xPos: tower.xPos, yPos:tower.yPos}, currentGraph as Graph, minion, false);
      else moveMinion({xPos:width-1, yPos:height-4}, {xPos: tower.xPos, yPos:tower.yPos}, currentGraph as Graph, minion, false);
    }
  }


  return (
    <>
      <div>
        <div className='gameContainer'>
          {/* Need to rename the components, but for now: ToolBar is on the left, GameStats is on the right */}
          <LeftBar
            currentTower={currentTower}
            currentMinion={currentMinion}
            towers={towers}
            />
          <Maze
            towers={towers}
            currentPlayer={currentPlayer}
            />
          <RightBar
            addNewMinion={addNewMinion}
            currentMinion={currentMinion}
            minions={minions}
            currentPlayer = {currentPlayer}
          />
          {gameEnded && <GameOver currentPlayer={currentPlayer}/>}
        </div>
      </div>
    </>
  );
}

export default Game;