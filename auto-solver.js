// ZETAMAX
// Usage: Paste into browser console (F12 > Console) and press Enter
// Stop:  Call stop() or press Escape

const CONFIG = {
  problemSelector: "span.problem",
  inputSelector: "input.answer",
  delayMs: 100,
  delayRangeMs: null, // [min, max] for random delay
  maxAnswers: Infinity,
  logAnswers: true,
};

let running = true;
let answerCount = 0;
let lastProblem = null;

// Stop function - call stop() in console to halt
function stop() {
  running = false;
  console.log("Stopped. Answered " + answerCount + " problems.");
}

// Expose globally
window.stop = stop;

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") stop();
});

function solve(expr) {
  let n = expr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/–/g, "-")
    .replace(/—/g, "-")
    .replace(/\s+/g, "")
    .replace(/=.*$/, "")
    .trim();

  if (!/^[\d+\-*/().]+$/.test(n)) {
    throw new Error("Invalid expression: " + n);
  }

  const result = Function('"use strict"; return (' + n + ")")();
  return Math.round(result * 1000000) / 1000000;
}

function getDelay() {
  if (CONFIG.delayRangeMs) {
    const [min, max] = CONFIG.delayRangeMs;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return CONFIG.delayMs;
}

function waitFor(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);

    const obs = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        obs.disconnect();
        resolve(el);
      }
    });

    obs.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => {
      obs.disconnect();
      reject(new Error("Timeout: " + selector));
    }, timeout);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  console.log("Started. Call stop() or press Escape to halt.");

  while (running && answerCount < CONFIG.maxAnswers) {
    try {
      const problemEl = await waitFor(CONFIG.problemSelector);
      const inputEl = await waitFor(CONFIG.inputSelector);
      const text = problemEl.textContent.trim();

      if (text === lastProblem) {
        await sleep(50);
        continue;
      }

      const answer = solve(text);
      lastProblem = text;

      inputEl.value = answer;
      inputEl.dispatchEvent(new Event("input", { bubbles: true }));
      inputEl.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          keyCode: 13,
          bubbles: true,
        }),
      );
      inputEl.dispatchEvent(
        new KeyboardEvent("keypress", {
          key: "Enter",
          keyCode: 13,
          bubbles: true,
        }),
      );
      inputEl.dispatchEvent(
        new KeyboardEvent("keyup", {
          key: "Enter",
          keyCode: 13,
          bubbles: true,
        }),
      );

      answerCount++;

      if (CONFIG.logAnswers) {
        console.log("#" + answerCount + ": " + text + " = " + answer);
      }

      await sleep(getDelay());
      await sleep(50);
    } catch (err) {
      console.error(err.message);
      await sleep(500);
    }
  }

  console.log("Finished. Answered " + answerCount + " problems.");
}

run();
