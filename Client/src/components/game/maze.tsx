import React, { useEffect, useState } from "react";
import '../../css/maze.css';
import apiService from "../../services/apiService";
import { Graph, value } from "../../utils/graph";
import { MazeTileType, minionType, TowerType } from "../../utils/types";
import MazeTile from "./mazeTile";
import Minion from "./minion";
import Tower from "./tower";
import Home from './home'
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { mazeComplete, setAllTilesHidden, setCurrentGraph } from "../../features/game_slice";

function Maze({ setCurrentTile, maze, setMaze, towers, setTowers, towersSorting, currentPlayer}: {
  setCurrentTile: React.Dispatch<React.SetStateAction<null | {xPos:number, yPos:number}>>,
  maze: {currentMinion: null | number, maze: MazeTileType[]},
  setMaze: React.Dispatch<React.SetStateAction<{currentMinion: null | number, maze: MazeTileType[]}>>
  towers: TowerType[],
  setTowers: React.Dispatch<React.SetStateAction<TowerType[]>>,
  towersSorting: {[key: number]: number},
  currentPlayer: 'p1' | 'p2'
}) {

  // TODO: Set as state
  const {boxSize, height, width, currentGraph, allTilesHidden, minions} = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();

  function setCurrentTileHelper(value: number) {
    setCurrentTile({
      xPos: value%width,
      yPos: Math.floor(value / width)
    })
  }

  const [displayVisited, setDisplayVisited] = useState<value[]>([]);
  const [mazeGenerated, setMazeGenerated] = useState(false);
  
  useEffect(() => {
    async function mazeInit(){
      const mazeTiles = document.getElementsByClassName('mazeTile');
      if (mazeGenerated === false) {
        setMazeGenerated(true);
        // const {graph, visited, classes, towers} = generateMaze(width,height)
        
        const {graphBE, visited, classes, towers} = await apiService.createMaze()
        let graph = new Graph()
        graph.reAssign(graphBE)
        console.log({graph, visited, classes, towers});
        
        setTowers(() => towers.map((tower:any) => {
          return {
            id: tower[0],
            xPos: tower[0]%width,
            yPos: Math.floor(tower[0]/width),
            numbers: tower[1],
            color: 'red',
            minion: null,
            minionAlignment: null,
            alignment: 'none',
            animations: [],
            minionSortingSpeed: null,
            sortingAlgo: 'bubble'
          }
        })
        )
        dispatch(setCurrentGraph(graph));
        setDisplayVisited(visited);
        setMaze(oldMaze => {
          const newMaze = [...oldMaze.maze];
          for (let value of visited) {
            newMaze[value as number] = {
              ...newMaze[value as number],
              classes: classes[value as value]
            }
          }
          return {...oldMaze, maze: newMaze};
        })
        
      }
      else if (allTilesHidden && currentGraph) {
        const mazeTiles = document.getElementsByClassName('mazeTile');
        console.log({mazeTiles})
        const halfway = Math.floor(mazeTiles.length/2);
        let index = -1;
        function step() {
          for (let i = 0; i < 50 - 49*((Math.abs(halfway - index)/halfway)); i++) {
            index++;
            if (index === displayVisited.length) break;
            const currentTile = mazeTiles[displayVisited[index] as number];
            currentTile.classList.remove('showNone');
          }

          if (index < displayVisited.length) requestAnimationFrame(step)
          else {
            dispatch(setAllTilesHidden(false));
            dispatch(mazeComplete());
          };
        }
        requestAnimationFrame(step);
      }
    }
    mazeInit();
  },[maze]);

  return (
    <>
      <div className="mazeOuter" onContextMenu={(e)=> e.preventDefault()}>
        <div className="mazeInner" style={{gridTemplateColumns: `repeat(${width}, 1fr)`}}>
          <Home xPos={0} yPos={0} boxSize={boxSize} player='p1'/>
          <Home xPos={width - 3} yPos={height - 3} boxSize={boxSize} player='p2'/>
          {Object.values(minions).map(minion => <Minion key={minion.id} boxSize={boxSize} minion={minion} currentPlayer={currentPlayer} setCurrentTile={setCurrentTile}/>)}
          {!allTilesHidden && towers.map(tower => <Tower key={tower.id} tower={tower} towersSorting={towersSorting} boxSize={boxSize} width={width} height={height} setCurrentTile={setCurrentTile}/>)}
          {maze.maze.map((value: {value: value, classes: string[], path: '' | 'THOUGHTPROCESS' | 'PATH'}, index) => <MazeTile key={index} generated={allTilesHidden} value={value.value as string} path={value.path} classes={value.classes} boxSize={boxSize} setCurrentTileHelper={setCurrentTileHelper} setCurrentTile={setCurrentTile}/>)}
        </div>
      </div>
    </>
  );
}

export default Maze;