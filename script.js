const display = document.getElementById("display");
const calculator = document.querySelector(".calculator");

let current = "0";
let stored = null;
let operator = null;
let waitingForNext = false;

function updateDisplay() {
  display.textContent = current;
}

function inputDigit(digit) {
  if (waitingForNext) {
    current = digit;
    waitingForNext = false;
    return;
  }

  current = current === "0" ? digit : current + digit;
}

function inputDecimal() {
  if (waitingForNext) {
    current = "0.";
    waitingForNext = false;
    return;
  }

  if (!current.includes(".")) {
    current += ".";
  }
}

function calculate(left, right, op) {
  const a = Number(left);
  const b = Number(right);

  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") {
    if (b === 0) return "不能除以 0";
    return a / b;
  }

  return b;
}

function formatResult(value) {
  if (typeof value === "string") return value;

  const rounded = Math.round(value * 1e10) / 1e10;
  return String(rounded);
}

function chooseOperator(nextOperator) {
  if (operator && !waitingForNext) {
    const result = calculate(stored, current, operator);
    current = formatResult(result);
    stored = current;
  } else {
    stored = current;
  }

  operator = nextOperator;
  waitingForNext = true;
  highlightOperator(nextOperator);
}

function highlightOperator(nextOperator) {
  calculator.querySelectorAll("[data-operator]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.operator === nextOperator);
  });
}

function clearAll() {
  current = "0";
  stored = null;
  operator = null;
  waitingForNext = false;
  highlightOperator(null);
}

function toggleSign() {
  if (current === "0" || current === "不能除以 0") return;
  current = current.startsWith("-") ? current.slice(1) : "-" + current;
}

function percent() {
  if (current === "不能除以 0") return;
  current = formatResult(Number(current) / 100);
}

function equals() {
  if (!operator || stored === null || current === "不能除以 0") return;

  const result = calculate(stored, current, operator);
  current = formatResult(result);
  stored = null;
  operator = null;
  waitingForNext = true;
  highlightOperator(null);
}

calculator.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.digit) {
    if (current === "不能除以 0") clearAll();
    inputDigit(button.dataset.digit);
  } else if (button.dataset.operator) {
    if (current === "不能除以 0") return;
    chooseOperator(button.dataset.operator);
  } else if (button.dataset.action === "decimal") {
    if (current === "不能除以 0") clearAll();
    inputDecimal();
  } else if (button.dataset.action === "clear") {
    clearAll();
  } else if (button.dataset.action === "sign") {
    toggleSign();
  } else if (button.dataset.action === "percent") {
    percent();
  } else if (button.dataset.action === "equals") {
    equals();
  }

  updateDisplay();
});

updateDisplay();
