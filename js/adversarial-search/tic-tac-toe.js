const X = "x"
const O = "o"
const WINNING_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const COMBO_NAMES = ["row1", "row2", "row3", "col1", "col2", "col3", "diag1", "diag2"];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMsgElement = document.getElementById('winning-msg')
const winningMsgTextElement = document.querySelector('[data-winning-msg-text]')
const comboElement = document.getElementById('combo')
const xButton = document.getElementById('x-btn')
const oButton = document.getElementById('o-btn')
const restartButton = document.getElementById('restart-btn')

let game = ["", "", "", "", "", "", "", "", ""];
let xTurn;

// startGame();
xButton.addEventListener('click', startXGame);
oButton.addEventListener('click', startOGame);

function startXGame() {
    startGame();
}

function startOGame() {
    startGame();
    // aiTurn();
    placeMark(cellElements[Math.floor(Math.random() * 9)], X);
    swapTurns();
    setBoardHoverClass();
}

function startGame() {
    xTurn = true;
    cellElements.forEach(cell => {
        cell.classList.remove(X);
        cell.classList.remove(O);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick);
    });
    comboElement.classList.remove('show')
    COMBO_NAMES.forEach(className => comboElement.classList.remove(className));
    game.fill("");
    setBoardHoverClass();
    winningMsgElement.classList.remove('show');
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = xTurn ? X : O;
    placeMark(cell, currentClass);
    
    disableCells();
    let combos = checkWin(currentClass)
    if (combos.length !== 0) {
        endGame(false, combos[0]);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setTimeout(() => {
            aiTurn();
        }, 400);
        setTimeout(() => {
            enableCells();
        }, 800);
    }
}

function aiTurn() {
    const currentClass = xTurn ? X : O;
    let max = -Infinity;
    let successors = getSuccessors();
    let maxIndex = successors[0];
    
    successors.forEach(i => {
        game[i] = currentClass;

        let val = minimax(game, false);
        if (val > max) {
            max = val;
            maxIndex = i;
        }

        game[i] = ""
    });

    placeMark(cellElements[maxIndex], currentClass);

    let combos = checkWin(currentClass)
    if (combos.length !== 0) {
        endGame(false, combos[0])
    } else if (isDraw()) {
        endGame(true)
    } else {
        swapTurns();
    }
}

function getSuccessors() {
    return game.reduce((arr, cell, i) => {
        !cell && arr.push(i);
        return arr;
    }, [])
}

function minimax(game, isMax) {
    let currentClass = xTurn ? X : O;
    if (checkWin(currentClass).length !== 0) return isMax ? -1 : 1;
    if (isDraw()) return 0;
    
    swapTurns();
    currentClass = xTurn ? X : O;
    
    let val = isMax ? -Infinity : Infinity;
    let successors = getSuccessors();
    
    successors.forEach(i => {
        game[i] = currentClass;
        
        val = isMax ? Math.max(val, minimax(game, false)) : Math.min(val, minimax(game, true));
        
        game[i] = ""
    });
    swapTurns();
    return val;
}

function placeMark(cell, currentClass) {
    let i = Array.from(cell.parentNode.children).indexOf(cell);
    game[i] = currentClass;

    cell.classList.add(currentClass);
    cell.removeEventListener('click', handleClick);
}

function checkWin(currentClass) {
    return WINNING_COMBOS.reduce((arr, combo, i) => {
        if (combo.every(index => {
            return game[index] === currentClass;
        })) {
            arr.push(i);
        }
        return arr;
    }, []);
}

function isDraw() {
    return game.every(cell => {
        return cell === X || cell === O;
    });
}

function endGame(draw, combo) {
    setTimeout(() => {
        if (draw) {
            winningMsgTextElement.textContent = "Draw!"
            winningMsgElement.classList.add('show');
        } else {
            comboElement.classList.add("show");
            comboElement.classList.add(COMBO_NAMES[combo]);
            winningMsgTextElement.textContent = `${xTurn ? "X's" : "O's"} Wins!`
            setTimeout(() => {
                winningMsgElement.classList.add('show');
            }, 1000);
        }
    }, 400);
}

function swapTurns() {
    xTurn = !xTurn;
}

function setBoardHoverClass() {
    if (xTurn) {
        board.classList.remove(O);
        board.classList.add(X);
    } else {
        board.classList.remove(X);
        board.classList.add(O);
    }
}

function disableCells() {
    cellElements.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
}

function enableCells() {
    cellElements.forEach(cell => {
        if (!cell.classList.contains(X) && !cell.classList.contains(O)) {
            cell.addEventListener('click', handleClick);
        }
    });
}