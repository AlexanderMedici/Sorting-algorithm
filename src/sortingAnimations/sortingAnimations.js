export function getMergeSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return animations;
  const auxiliaryArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
  return animations;
}

export function getMergeSortArray(array) {
  if (array.length <= 1) return array.slice();
  const mainArray = array.slice();
  const auxiliaryArray = array.slice();
  mergeSortHelper(mainArray, 0, mainArray.length - 1, auxiliaryArray, []);
  return mainArray;
}

export function getQuickSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return animations;
  const auxiliaryArray = array.slice();
  quickSortHelper(auxiliaryArray, 0, auxiliaryArray.length - 1, animations);
  return animations;
}

export function getQuickSortArray(array) {
  if (array.length <= 1) return array.slice();
  const result = array.slice();
  quickSortHelper(result, 0, result.length - 1, []);
  return result;
}

export function getHeapSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return animations;
  const auxiliaryArray = array.slice();
  heapSortHelper(auxiliaryArray, animations);
  return animations;
}

export function getHeapSortArray(array) {
  if (array.length <= 1) return array.slice();
  const result = array.slice();
  heapSortHelper(result, []);
  return result;
}

export function getBubbleSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return animations;
  const auxiliaryArray = array.slice();
  bubbleSortHelper(auxiliaryArray, animations);
  return animations;
}

export function getBubbleSortArray(array) {
  if (array.length <= 1) return array.slice();
  const result = array.slice();
  bubbleSortHelper(result, []);
  return result;
}

function mergeSortHelper(
  mainArray,
  startIdx,
  endIdx,
  auxiliaryArray,
  animations
) {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(
  mainArray,
  startIdx,
  middleIdx,
  endIdx,
  auxiliaryArray,
  animations
) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  while (i <= middleIdx && j <= endIdx) {
    // These are the values that we're comparing; we push them once
    // to change their color.
    animations.push([i, j]);
    // These are the values that we're comparing; we push them a second
    // time to revert their color.
    animations.push([i, j]);
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      // We overwrite the value at index k in the original array with the
      // value at index i in the auxiliary array.
      animations.push([k, auxiliaryArray[i]]);
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      // We overwrite the value at index k in the original array with the
      // value at index j in the auxiliary array.
      animations.push([k, auxiliaryArray[j]]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }
  while (i <= middleIdx) {
    // These are the values that we're comparing; we push them once
    // to change their color.
    animations.push([i, i]);
    // These are the values that we're comparing; we push them a second
    // time to revert their color.
    animations.push([i, i]);
    // We overwrite the value at index k in the original array with the
    // value at index i in the auxiliary array.
    animations.push([k, auxiliaryArray[i]]);
    mainArray[k++] = auxiliaryArray[i++];
  }
  while (j <= endIdx) {
    // These are the values that we're comparing; we push them once
    // to change their color.
    animations.push([j, j]);
    // These are the values that we're comparing; we push them a second
    // time to revert their color.
    animations.push([j, j]);
    // We overwrite the value at index k in the original array with the
    // value at index j in the auxiliary array.
    animations.push([k, auxiliaryArray[j]]);
    mainArray[k++] = auxiliaryArray[j++];
  }
}

function quickSortHelper(array, startIdx, endIdx, animations) {
  if (startIdx >= endIdx) return;
  const pivotIdx = partition(array, startIdx, endIdx, animations);
  quickSortHelper(array, startIdx, pivotIdx - 1, animations);
  quickSortHelper(array, pivotIdx + 1, endIdx, animations);
}

function partition(array, startIdx, endIdx, animations) {
  const pivotValue = array[endIdx];
  let pivotIdx = startIdx;
  for (let i = startIdx; i < endIdx; i++) {
    animations.push(["compare", i, endIdx]);
    animations.push(["revert", i, endIdx]);
    if (array[i] < pivotValue) {
      if (pivotIdx !== i) {
        animations.push(["swap", pivotIdx, i]);
      }
      const temp = array[pivotIdx];
      array[pivotIdx] = array[i];
      array[i] = temp;
      pivotIdx++;
    }
  }
  if (pivotIdx !== endIdx) {
    animations.push(["swap", pivotIdx, endIdx]);
  }
  const temp = array[pivotIdx];
  array[pivotIdx] = array[endIdx];
  array[endIdx] = temp;
  return pivotIdx;
}

function heapSortHelper(array, animations) {
  const lastParentIdx = Math.floor((array.length - 2) / 2);
  for (let i = lastParentIdx; i >= 0; i--) {
    siftDown(array, i, array.length - 1, animations);
  }
  for (let endIdx = array.length - 1; endIdx > 0; endIdx--) {
    animations.push(["swap", 0, endIdx]);
    const temp = array[0];
    array[0] = array[endIdx];
    array[endIdx] = temp;
    siftDown(array, 0, endIdx - 1, animations);
  }
}

function siftDown(array, startIdx, endIdx, animations) {
  let rootIdx = startIdx;
  while (rootIdx * 2 + 1 <= endIdx) {
    const leftIdx = rootIdx * 2 + 1;
    const rightIdx = leftIdx + 1;
    let swapIdx = rootIdx;

    animations.push(["compare", swapIdx, leftIdx]);
    animations.push(["revert", swapIdx, leftIdx]);
    if (array[leftIdx] > array[swapIdx]) {
      swapIdx = leftIdx;
    }

    if (rightIdx <= endIdx) {
      animations.push(["compare", swapIdx, rightIdx]);
      animations.push(["revert", swapIdx, rightIdx]);
      if (array[rightIdx] > array[swapIdx]) {
        swapIdx = rightIdx;
      }
    }

    if (swapIdx === rootIdx) return;
    animations.push(["swap", rootIdx, swapIdx]);
    const temp = array[rootIdx];
    array[rootIdx] = array[swapIdx];
    array[swapIdx] = temp;
    rootIdx = swapIdx;
  }
}

function bubbleSortHelper(array, animations) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      animations.push(["compare", j, j + 1]);
      animations.push(["revert", j, j + 1]);
      if (array[j] > array[j + 1]) {
        animations.push(["swap", j, j + 1]);
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
  }
}
