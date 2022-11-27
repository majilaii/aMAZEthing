import '../../css/sort-lesson.css'
import { useEffect, useState } from 'react'
import { insertionSortAlgo } from "../../utils/sorting-algo";

export default function InsertionLesson() {

    const [array, setArray] = useState([5, 6, 1, 2, 3, 1, 7, 2, 8]);
    const [clicked, setClicked] = useState(false)

    let paragraphs = {
        sortName: "Insertion sort",
        firstP:
          "Insertion Sort is also a simple sorting algorithm that swaps two elements if they are in the wrong order. This algorithm is not suitable for large data sets as its average and worst-case time complexity is quite high.",
        secondP: "As we go through each element, if the current element is smaller than the previous one, the elements are swapped"
      };

    async function insertionSort() {
        setClicked(true)
        const copyArr = array.slice();
        const {ArrayStates, animations} = insertionSortAlgo(copyArr as any);
        for(let i = 0; i<animations.length; i++) {
          await delay(300)
          if(animations[i].length > 2){

            const [indexOne, elementOne, indexTwo, elementTwo] = animations[i]
            document.getElementById(`${indexOne}`)!.style.backgroundColor = 'red'
            document.getElementById(`${indexTwo}`)!.style.backgroundColor = 'red'
            document.getElementById(`${indexOne}`)!.style.transform += `translateX(-40px)`
            document.getElementById(`${indexTwo}`)!.style.transform += `translateX(40px)`
            await delay(300)
            document.getElementById(`${indexOne}`)!.style.backgroundColor = 'green'
            document.getElementById(`${indexTwo}`)!.style.backgroundColor = 'green'
            let tempNode =  document.getElementById(`${indexTwo}`) 
            document.getElementById(`${indexOne}`)!.id = `${indexTwo}`
            tempNode!.id =`${indexOne}`
          } else {
              const [indexOne, elementOne] = animations[i]
              document.getElementById(`${indexOne}`)!.style.backgroundColor = 'red'
              await delay(300)
              document.getElementById(`${indexOne}`)!.style.backgroundColor = 'green'
          }
        }
          
      }

      function delay(time:number) {
        return new Promise((res) => setTimeout(res, time));
      }
    

    return (
        <div className="whole-page-wrapper">
          <div className="lesson-wrapper">
            <h1>{paragraphs.sortName}</h1>
            <p>{paragraphs.firstP}</p>
          </div>
  
          <div className="lesson-wrapper-2">
            <p>{paragraphs.secondP}</p>
            <div>
          {!clicked ? (
            <button className="button clickSort" onClick={insertionSort}>
              visualize 
            </button>
          ) : 
            <button className="button clickSort-clicked" onClick={() => window.location.reload()}>
                refresh the page {/*refresh to visualize again after the array is sorted*/}
            </button>
          }
        </div>
          </div>
  
          <div className="array">
              {array.map((element:any, index) => (
                <div
                className={`array-el`}
                style={{
                  backgroundColor: "green",
                  height: `${element*20}px`,
                }}
                id={`${index}`}
                key={index}
                >
                  {" "}
                  {element}{" "}
                </div>
              ))}
            </div>
        </div>
    );
}