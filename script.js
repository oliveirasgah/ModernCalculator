let runningTotal = 0;
let buffer = "0";
let previousOperator;
let clearScreen = true;
let operations = {
  "×": function (floatBuffer) {
    runningTotal *= floatBuffer;
  },
  "−": function (floatBuffer) {
    runningTotal -= floatBuffer;
  },
  "+": function (floatBuffer) {
    runningTotal += floatBuffer;
  },
  "÷": function (floatBuffer) {
    let precision;
    let result = runningTotal / floatBuffer;

    for (precision = 6; precision > 0; precision--) {
      result = roundFloat(result, precision);
      if (result.toString().length <= 8) break;
    }

    runningTotal = precision > 0 ? result : parseInt(result);
  },
};

const screen = document.querySelector("#screen");

function buttonClick(value) {
  if (isNaN(value)) {
    handleSymbol(value);
  } else {
    handleNumber(value);
  }

  if (buffer.toString().length > 8) buffer = "Error";

  screen.innerText = buffer;
}

function handleSymbol(symbol) {
  switch (symbol) {
    case "C":
      runningTotal = 0;
      buffer = "0";
      clearScreen = true;
      break;
    case "←":
      if (buffer == "Error") return;

      if (buffer.length == 1) {
        buffer = "0";
      } else {
        buffer = buffer.substring(0, buffer.length - 1);
      }

      break;
    case "=":
      if (buffer == "Error") return;

      if (previousOperator === null) {
        return;
      }

      flushOperation(parseFloat(buffer));
      previousOperator = null;
      buffer = runningTotal;
      runningTotal = 0;
      break;
    case ".":
      if (buffer == "Error") return;

      if (buffer.indexOf(".") == -1) {
        buffer += ".";
      }

      break;
    default:
      if (buffer == "Error") return;

      handleMath(symbol);

      break;
  }
}

function handleNumber(numberString) {
  if (buffer == "Error") return;

  if (buffer == "0" || clearScreen) {
    buffer = numberString;
    clearScreen = false;
  } else {
    if (buffer.length < 8) buffer += numberString;
  }
}

function handleMath(symbol) {
  if (buffer === "0") {
    return;
  }

  const floatBuffer = parseFloat(buffer);

  if (runningTotal == 0) {
    runningTotal = floatBuffer;
  } else {
    flushOperation(floatBuffer);
  }

  previousOperator = symbol;
  clearScreen = true;
  buffer = runningTotal.toString();
}

function flushOperation(floatBuffer) {
  operations[previousOperator](floatBuffer);
}

function roundFloat(number, precision) {
  let precisionUnits = 10 ** precision;
  return (
    Math.round((number + Number.EPSILON) * precisionUnits) / precisionUnits
  );
}

function init() {
  document
    .querySelector(".calc-keyboard")
    .addEventListener("click", function (event) {
      const className = event.target.className;

      if (
        className.includes("calc-button") &&
        !className.includes("calc-buttons")
      )
        buttonClick(event.target.innerText);
    });
}

init();

