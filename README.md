# Sorting Visualizer

Interactive sorting visualizer built with React. It renders a bar chart array and animates multiple sorting algorithms with controls, live feedback, and toast notifications.

## Features

- Visualizes merge, quick, heap, and bubble sort.
- Start/complete toasts with algorithm explanations and Big-O notes.
- Stop button to cancel running animations.
- Generate new arrays on demand.
- Responsive layout with horizontal scrolling on small screens.
- Simple test runner for algorithm correctness.

## Demo

Run locally and open http://localhost:3000 after starting the dev server.

## Getting Started

Prerequisites:
- Node.js (recommended: latest LTS)
- npm

Install dependencies:
```
npm install
```

Start the dev server:
```
npm start
```

## Usage

- Generate New Array: creates a new randomized set of bars.
- Merge Sort / Quick Sort / Heap Sort / Bubble Sort: runs animations.
- Stop: cancels all pending animations and resets colors.
- Test Sorting Algorithms: runs correctness checks in the console and shows status on screen.

## Algorithms Included

- Merge Sort: stable, O(n log n).
- Quick Sort: average O(n log n), worst O(n^2).
- Heap Sort: O(n log n).
- Bubble Sort: O(n^2).

## What These Algorithms Are Used For

- Merge Sort: reliable, stable sort used in data processing pipelines, external sorting on large data, and when predictable O(n log n) behavior matters.
- Quick Sort: fast in practice for in-memory arrays; common in standard library sorts or as a building block for partial sorting and selection.
- Heap Sort: good when you need O(n log n) worst-case time with low extra memory; also used to implement priority queues.
- Bubble Sort: mostly educational; useful for teaching, simple demos, or tiny datasets where code clarity matters more than performance.

## Project Structure

```
src/
  App.js
  index.js
  SortingVisualizer/
    SortingVisualizer.jsx
    SortingVisualizer.css
  sortingAnimations/
    sortingAnimations.js
```

Key files:
- `src/SortingVisualizer/SortingVisualizer.jsx`: UI and animation control.
- `src/sortingAnimations/sortingAnimations.js`: algorithm animation generation and array-sorting helpers.
- `src/SortingVisualizer/SortingVisualizer.css`: layout and button styling.

## Configuration

You can tweak these constants in `src/SortingVisualizer/SortingVisualizer.jsx`:
- `ANIMATION_SPEED_MS`: animation speed.
- `NUMBER_OF_ARRAY_BARS`: number of bars in the array.

## Scripts

```
npm start
npm test
npm run build
```

## Troubleshooting

- If you see "ReactDOM.render is not a function", ensure `src/index.js` uses `createRoot` from `react-dom/client`.
- If toasts do not appear, ensure `react-toastify` is installed:
  ```
  npm install react-toastify
  ```

## License

MIT
