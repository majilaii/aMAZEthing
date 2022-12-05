import '../../css/rightBar.css';
import ShopSVG from '../svg/ShopSVG';
import { animal, minionType } from '../../utils/types';
import { Squirrel, Badger, Hare, Deer, Koala, Bear } from '../svg/animalsSVG';
import { useState } from 'react';
import Shop from './shop';
import CloseCross from '../svg/closeCross';
import { useAppDispatch, useAppSelector } from '../../features/hooks';
import { updateCurrentMinion } from '../../features/game_slice';

function storeButtonHover(isOnHover: boolean) {
  document.querySelectorAll('.store-button-yellow').forEach((svgEl) => {
    isOnHover
      ? ((svgEl as unknown as HTMLElement).style.fill = `var(--red)`)
      : ((svgEl as unknown as HTMLElement).style.fill = `var(--yellow)`);
  });
  document.querySelectorAll('.store-button-red').forEach((svgEl) => {
    isOnHover
      ? ((svgEl as unknown as HTMLElement).style.fill = `var(--yellow)`)
      : ((svgEl as unknown as HTMLElement).style.fill = `var(--red)`);
  });
}

function crossButtonHover(isOnHover: boolean) {
  document.querySelectorAll('.close-cross-green').forEach((svgEl) => {
    isOnHover
      ? ((svgEl as unknown as HTMLElement).style.fill = `#96B0A2`)
      : ((svgEl as unknown as HTMLElement).style.fill = `var(--white-green)`)

  });
}

function whichAnimalSVG (minion: minionType) {
  return (
    minion.type === 'Squirrel' ? <Squirrel currentPlayer={`${minion.alignment}-color`} /> :
    minion.type === 'Badger' ? <Badger currentPlayer={`${minion.alignment}-color`} /> :
    minion.type === 'Hare' ? <Hare currentPlayer={`${minion.alignment}-color`} /> :
    minion.type === 'Deer' ? <Deer currentPlayer={`${minion.alignment}-color`} /> :
    minion.type === 'Koala' ? <Koala currentPlayer={`${minion.alignment}-color`} /> :
    minion.type === 'Bear' && <Bear currentPlayer={`${minion.alignment}-color`} />
  )
}

function styleCurrentMinionBorder(currentMinId: number) {
  const allYourMinions = document.querySelectorAll('.your-minion-button');

  allYourMinions.forEach(minion => {
    (minion as unknown as HTMLElement).style.backgroundColor = 'var(--green)';
  });

  (document.querySelector(`.right-bar-selector-${currentMinId}`) as unknown as HTMLElement).style.backgroundColor = 'var(--purple)';
}

function RightBar({
  addNewMinion,
  currentMinion,
  minions,
  currentPlayer
}: {
  addNewMinion: (type: animal, player: 'p1' | 'p2') => void;
  currentMinion: null | number,
  minions: {[key: number]: minionType},
  currentPlayer: 'p1' | 'p2'
}) {
 
  const [shopOpen, setShopOpen] = useState(false);
  const {allTilesHidden} = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();

  let allPlayerMinions: Array<minionType> = [];

  [minions].forEach((allMinions) => {
    for (const minion in allMinions) {
      if (allMinions[minion].alignment === currentPlayer) {
        allPlayerMinions.push(allMinions[minion]);
      }
    }
  });

  let minionsToRender = allPlayerMinions.map((p1minion) => {
    return (
      <>
        <div className={`your-minion-button right-bar-selector-${p1minion.id}`} onClick={() => {
            dispatch(updateCurrentMinion(p1minion.id));
            styleCurrentMinionBorder(p1minion.id);

          }}>
          <h1 className='right-bar-name'>{p1minion.name}</h1>
          <h1 className='current-minion-svg-left-bar'>{whichAnimalSVG(minions[p1minion.id])}</h1>
        </div>
      </>
    )
  })



  return (
    <div className='right-bar'>

      {shopOpen ? (
        <Shop addNewMinion={addNewMinion} minions={minions} currentPlayer = {currentPlayer}/>
      ) : <div className='your-minions'>
      {minions &&
        // Should be a name instead
        <>
          <ul className='your-minions-list'>
            {minionsToRender}
          </ul>
        </>
      }
      </div>}


      {!allTilesHidden && (
        <button
          
          className='store-button'
          style={shopOpen ? {backgroundColor: 'var(--sand)'} : {backgroundColor: 'transparent'}}
          onClick={() => {shopOpen ? setShopOpen(false) : setShopOpen(true)}}
          onMouseEnter={() => {storeButtonHover(true); crossButtonHover(true)}}
          onMouseLeave={() => {storeButtonHover(false); crossButtonHover(false)}}
        >
          <div id="store-button" className='shopSVG'>
            {shopOpen
              ? <div className='cross-size'><CloseCross /></div>
              : <ShopSVG />
            }

          </div>
        </button>
      )}
    </div>
  );
}

export default RightBar;