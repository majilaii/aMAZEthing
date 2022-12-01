import '../css/towerPopup.css';
import { bubbleSortAlgo } from '../utils/sorting-algo';
import { bubbleSortVisual, insertionSortVisual, mergeSortVisual, quickSortVisual, selectionSortVisual } from '../utils/sorting-helper-visual';
import { minionType, TowerType } from '../utils/types';
import Visualization from './sortingLessons/visualization';


function TowerPopup ({boxSize, tower, width, height, towersSorting, zoomed}: {boxSize: number, tower: TowerType, width: number, height: number, towersSorting: {[key: number]: number}, zoomed: boolean}) {
  return <div style={tower.minion !== null && !zoomed ? {'opacity': 1} : {'opacity': 0}} className={`towerPopup ${
    tower.id/width < height/4 ? 'downPopup' :
    tower.id/width > 3*height/4 ? 'upPopup' :
    width - tower.id%width < width/3 ? 'leftPopup' : 
    'rightPopup'
  }`
  }>
    <Visualization 
      array={tower.numbers} 
      width={3*boxSize/5} 
      margin={2} 
      height={3*boxSize/5} 
      animations={tower.animations} 
      sortingAlgo={
        tower.sortingAlgo === 'bubble' ? bubbleSortVisual :
        tower.sortingAlgo === 'selection' ? selectionSortVisual :
        tower.sortingAlgo === 'insertion' ? insertionSortVisual :
        tower.sortingAlgo === 'merge' ? mergeSortVisual :
        quickSortVisual
      } 
      key={tower.numbers} 
      clicked={tower.minion !== null && !towersSorting[tower.id]++} 
      delay={tower.minionSortingSpeed} 
      tower={tower.id}/>
  </div>
}

export default TowerPopup;