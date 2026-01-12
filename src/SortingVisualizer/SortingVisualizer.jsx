import React from "react"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SortingVisualizer.css"; 
import { 
  getMergeSortAnimations,
  getMergeSortArray,
  getQuickSortAnimations,
  getQuickSortArray,
  getHeapSortAnimations,
  getHeapSortArray,
  getBubbleSortAnimations,
  getBubbleSortArray,
} from "../sortingAnimations/sortingAnimations";



// Change this value for the speed of the animations.
const ANIMATION_SPEED_MS = 1;

// Change this value for the number of bars (value) in the array.
const NUMBER_OF_ARRAY_BARS = 310;

// This is the main color of the array bars.
const PRIMARY_COLOR = 'navy';

// This is the color of array bars that are being compared throughout the animations.
const SECONDARY_COLOR = 'yellow';


export default class SortingVisualizer extends React.Component { 
    constructor (props) {
        super( props ); 
        this.state  = {
            array: [],
            testStatus: "",


        }
        this.animationTimeouts = [];
        this.activeToastId = null;
    }
    componentDidMount () {
        this.resetArray(); 
    }
    

    resetArray () { 
        this.stopAnimations();
        const array = []; 
        for ( let i = 0; i < NUMBER_OF_ARRAY_BARS; i++ ){
            array.push(randomIntFromInterval(5, 730))
        }
        this.setState({array})
    }
    

     mergeSort() {
    this.stopAnimations();
    const animations = getMergeSortAnimations(this.state.array);
    const toastId = this.notifySortStart("Merge Sort");
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        this.scheduleAnimation(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
      } else {
        this.scheduleAnimation(() => {
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        }, i * ANIMATION_SPEED_MS);
      }
    }
    this.scheduleCompletionToast(animations.length, toastId, "Merge Sort");
  }

  quickSort() {
    this.stopAnimations();
    const animations = getQuickSortAnimations(this.state.array);
    const toastId = this.notifySortStart("Quick Sort");
    this.animateSorting(animations);
    this.scheduleCompletionToast(animations.length, toastId, "Quick Sort");
  }

  heapSort() {
    this.stopAnimations();
    const animations = getHeapSortAnimations(this.state.array);
    const toastId = this.notifySortStart("Heap Sort");
    this.animateSorting(animations);
    this.scheduleCompletionToast(animations.length, toastId, "Heap Sort");
  }

  bubbleSort() {
    this.stopAnimations();
    const animations = getBubbleSortAnimations(this.state.array);
    const toastId = this.notifySortStart("Bubble Sort");
    this.animateSorting(animations);
    this.scheduleCompletionToast(animations.length, toastId, "Bubble Sort");
  }

  animateSorting(animations) {
    const arrayBars = document.getElementsByClassName('array-bar');
    for (let i = 0; i < animations.length; i++) {
      const [type, barOneIdx, barTwoIdx] = animations[i];
      if (type === "compare" || type === "revert") {
        const color = type === "compare" ? SECONDARY_COLOR : PRIMARY_COLOR;
        this.scheduleAnimation(() => {
          const barOneStyle = arrayBars[barOneIdx].style;
          const barTwoStyle = arrayBars[barTwoIdx].style;
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
      } else if (type === "swap") {
        this.scheduleAnimation(() => {
          const barOneStyle = arrayBars[barOneIdx].style;
          const barTwoStyle = arrayBars[barTwoIdx].style;
          const tempHeight = barOneStyle.height;
          barOneStyle.height = barTwoStyle.height;
          barTwoStyle.height = tempHeight;
        }, i * ANIMATION_SPEED_MS);
      }
    }
  }

  scheduleAnimation(callback, delay) {
    const timeoutId = setTimeout(callback, delay);
    this.animationTimeouts.push(timeoutId);
  }

  stopAnimations() {
    if (!this.animationTimeouts.length) return;
    for (const timeoutId of this.animationTimeouts) {
      clearTimeout(timeoutId);
    }
    this.animationTimeouts = [];
    const arrayBars = document.getElementsByClassName('array-bar');
    for (let i = 0; i < arrayBars.length; i++) {
      arrayBars[i].style.backgroundColor = PRIMARY_COLOR;
    }
    if (this.activeToastId !== null) {
      toast.dismiss(this.activeToastId);
      this.activeToastId = null;
    }
  }

  notifySortStart(sortName) {
    const description = this.getSortDescription(sortName);
    const toastId = toast.info(
      `${sortName} started. ${description}`,
      {
      autoClose: false,
      }
    );
    this.activeToastId = toastId;
    return toastId;
  }

  scheduleCompletionToast(animationCount, toastId, sortName) {
    const delay = animationCount * ANIMATION_SPEED_MS;
    this.scheduleAnimation(() => {
      const description = this.getSortDescription(sortName);
      toast.update(toastId, {
        render: `${sortName} completed. ${description}`,
        type: toast.TYPE.SUCCESS,
        autoClose: 2000,
      });
      this.activeToastId = null;
    }, delay);
  }

  getSortDescription(sortName) {
    switch (sortName) {
      case "Bubble Sort":
        return "Swaps adjacent bars until all are in order. O(n^2).";
      case "Quick Sort":
        return "Partitions around a pivot, then sorts each side. Avg O(n log n), worst O(n^2).";
      case "Merge Sort":
        return "Splits, sorts halves, and merges them back together. O(n log n).";
      case "Heap Sort":
        return "Builds a heap and repeatedly extracts the largest. O(n log n).";
      default:
        return "Sorts the array.";
    }
  }

  // NOTE: This method will only work if your sorting algorithms actually return
  // the sorted arrays; if they return the animations (as they currently do), then
  // this method will be broken.
  testSortingAlgorithms() {
    this.setState({ testStatus: "Running tests..." });
    let allPassed = true;
    for (let i = 0; i < 100; i++) {
      const array = [];
      const length = randomIntFromInterval(1, 1000);
      for (let i = 0; i < length; i++) {
        array.push(randomIntFromInterval(-1000, 1000));
      }
      const javaScriptSortedArray = array.slice().sort((a, b) => a - b);
      const mergeSortedArray = getMergeSortArray(array.slice());
      const quickSortedArray = getQuickSortArray(array.slice());
      const heapSortedArray = getHeapSortArray(array.slice());
      const bubbleSortedArray = getBubbleSortArray(array.slice());
      const mergeOk = arraysAreEqual(javaScriptSortedArray, mergeSortedArray);
      const quickOk = arraysAreEqual(javaScriptSortedArray, quickSortedArray);
      const heapOk = arraysAreEqual(javaScriptSortedArray, heapSortedArray);
      const bubbleOk = arraysAreEqual(javaScriptSortedArray, bubbleSortedArray);
      if (!mergeOk || !quickOk || !heapOk || !bubbleOk) {
        allPassed = false;
      }
    }
    this.setState({
      testStatus: allPassed ? "All tests passed." : "Test failed.",
    });
  }

  render() {
    const {array, testStatus} = this.state;

    return (
      <div className="array-container">
        <div className="bars-row">
        {array.map((value, idx) => (
          <div
            className="array-bar"
            key={idx}
            style={{
              backgroundColor: PRIMARY_COLOR,
              height: `${value}px`,
            }}></div>
        ))}
        </div>
        <div className="controls-row">
          <button onClick={() => this.resetArray()}>Generate New Array</button>
          <button onClick={() => this.mergeSort()}>Merge Sort</button>
          <button onClick={() => this.quickSort()}>Quick Sort</button>
          <button onClick={() => this.heapSort()}>Heap Sort</button>
          <button onClick={() => this.bubbleSort()}>Bubble Sort</button>
          <button onClick={() => this.stopAnimations()}>Stop</button>
          <button onClick={() => this.testSortingAlgorithms()}>
            Test Sorting Algorithms
          </button>
          {testStatus && <div className="test-status">{testStatus}</div>}
        </div>
        <ToastContainer position="bottom-right" newestOnTop />
      </div>
    );
  }
}

// From https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function arraysAreEqual(arrayOne, arrayTwo) {
  if (arrayOne.length !== arrayTwo.length) return false;
  for (let i = 0; i < arrayOne.length; i++) {
    if (arrayOne[i] !== arrayTwo[i]) {
      return false;
    }
  }
  return true;
}
