# Zetamax - Zetamac Auto-Solver

Automatically solves math problems on Zetamac.

## Usage

1. Open Zetamac in your browser
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Paste the contents of `auto-solver.js` and press Enter

## Controls

- Press **Escape** or call `stop()` to stop

## Configuration

Edit the `CONFIG` object at the top of `auto-solver.js`:

```js
const CONFIG = {
  delayMs: 100,           // Delay between answers (ms)
  delayRangeMs: null,     // Random delay range, e.g. [50, 150]
  maxAnswers: Infinity,   // Stop after this many answers
  logAnswers: true,       // Log answers to console
};
```
