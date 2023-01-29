let runningTotal = 0;
let buffer = "0";
let previousOperator;
let operations = {
    '×': function (floatBuffer) { runningTotal *= floatBuffer; },
    '−': function (floatBuffer) { runningTotal -= floatBuffer; },
    '+': function (floatBuffer) { runningTotal += floatBuffer; },
    '÷': function (floatBuffer) { runningTotal /= floatBuffer; },
}

const screen = document.querySelector('#screen');

function buttonClick(value) {
    if (isNaN(value)) {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }

    if(buffer.toString().length > 8)
        buffer = 'Error';

    screen.innerText = buffer;
}

function handleSymbol(symbol) {
    switch (symbol) {
        case 'C':
            runningTotal = 0;
            buffer = '0';
            break;
        case '←':
            if(buffer == 'Error')
                return;

            if (buffer.length == 1) {
                buffer = '0';
            } else {
                buffer = buffer.substring(0, buffer.length - 1);
            }

            break;
        case '=':
            if(buffer == 'Error')
                return;

            if (previousOperator === null) {
                return;
            }

            flushOperation(parseFloat(buffer));
            previousOperator = null;
            buffer = runningTotal;
            runningTotal = 0;
            break;
        case '.':
            if(buffer == 'Error')
                return;

            if(buffer.indexOf('.') == -1) {
                buffer += '.';
            }

            break;
        default:
            if(buffer == 'Error')
                return;

            handleMath(symbol);
            break;
    }
}

function handleNumber(numberString) {
    if(buffer == 'Error')
        return;

    if (buffer == '0') {
        buffer = numberString;
    } else {
        if (buffer.length < 8)
            buffer += numberString;
    }
}

function handleMath(symbol) {
    if (buffer === '0') {
        return;
    }

    const floatBuffer = parseFloat(buffer);

    if (runningTotal == 0) {
        runningTotal = floatBuffer;
    } else {
        flushOperation(floatBuffer);
    }

    previousOperator = symbol;
    buffer = '0';
}

function flushOperation(floatBuffer) {
    operations[previousOperator](floatBuffer);
}

function init() {
    document.querySelector('.calc-keyboard').addEventListener('click', function (event) {
        const className = event.target.className;
        
        if(className.includes('calc-button') && !className.includes('calc-buttons'))
            buttonClick(event.target.innerText);
    });
}

init();