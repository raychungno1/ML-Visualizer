import { Connect4 } from "./connect4.js"

const Y = "yellow"
const R = "red"
const cellElements = document.querySelectorAll('[data-cell]');
let cellSize = cellElements[0].offsetHeight;
const board = document.getElementById('board');
const innerBoard = document.getElementById('inner-board');
const winningMsgElement = document.getElementById('winning-msg')
const winningMsgTextElement = document.querySelector('[data-winning-msg-text]')
const buttonsTxt = document.getElementById("buttons-txt")

const xButton = document.getElementById('y-btn')
const oButton = document.getElementById('r-btn')

let game;
var mouseX;

xButton.addEventListener('click', startYGame);
oButton.addEventListener('click', startRGame);

function startYGame() {
    startGame();
}

function startRGame() {
    startGame();
    aiMove();
}

function startGame() {
    game = new Connect4();
    let combo = document.querySelector(".c4-combo");
    if (combo) innerBoard.removeChild(combo);
    winningMsgElement.classList.remove('show');
    cellElements.forEach(cell => {
        cell.classList.remove(R);
        cell.classList.remove(Y);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick);
        cell.removeEventListener('mouseover', handleHover);
        cell.addEventListener('mouseover', handleHover);
        cell.removeEventListener('mouseleave', handleUnHover);
        cell.addEventListener('mouseleave', handleUnHover);
    });

    // let m = [0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 3, 3, 3, 3, 6, 6, 6, 6, 5, 5, 5];
    let m = [0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 1, 0, 3, 2, 5, 4, 2, 6, 0, 1, 4, 5, 6, 0, 6, 3]
    m.forEach(col => {
        game.move(col);
        cellElements[7 * (game.empty[col] + 2) + col].classList.add(game.yTurn ? R : Y)
    })
}

// Makes a placement if valid
function handleClick(e) {
    let currentClass = game.yTurn ? Y : R;
    let [row, col] = getCoords(e.target);
    if (!game.isValid(col)) return;

    // Remove hover elements
    cellElements[col].classList.remove(currentClass);
    cellElements[7 * row + col].classList.remove(currentClass, "hovering");

    // Create & animate circle
    let circle = createCircle(row, col, currentClass);
    board.insertBefore(circle, board.firstChild);

    disableCells();
    window.addEventListener("mousemove", mouseMove);
    game.move(col); // Perform move on logical representation

    // Runs once animation finishes
    setTimeout(() => {
        board.removeChild(circle);

        cellElements[(7 * row) + col].classList.add(currentClass);
        
        let combo = game.checkWin(col)
        if (combo) {
            endGame(false, combo);
        } else if (game.isDraw()) {
            endGame(true);
        } else {
            setTimeout(() => {
                enableCells();
                aiMove();
                addHoverByMousePos(col);
                window.removeEventListener("mousemove", mouseMove);
            }, 250);
        }

    }, 250);
}

// Adds classes when hovering over cell
function handleHover(e) {
    const currentClass = game.yTurn ? Y : R;
    let [row, col] = getCoords(e.target);
    if (!game.isValid(col)) return;

    cellElements[col].classList.add(currentClass);
    cellElements[(7 * row) + col].classList.add(currentClass, "hovering");
}

// Removes classes after hovering over cell
function handleUnHover(e) {
    const currentClass = game.yTurn ? Y : R;
    let [row, col] = getCoords(e.target);

    cellElements[col].classList.remove(currentClass);
    cellElements[(7 * row) + col].classList.remove(currentClass, "hovering");
}

// Gets the location (row, col) of a cell
function getCoords(cell) {
    let col = [...cellElements].indexOf(cell) % 7;
    let row = game.empty[col] + 1
    return [row, col];
}

// Create & animate a circle
function createCircle(row, col, currentClass) {
    let circle = document.createElement("div");
    circle.classList.add(currentClass, "circle");
    circle.style.left = `${cellElements[col].getBoundingClientRect().left}px`
    circle.animate(
        [{ transform: 'translateY(0px)' }, { transform: `translateY(${cellSize * row}px)` }], 
        { duration: 251 }
    );
    return circle;
}

// Tracks the mouse's X-position
function mouseMove(e) {
    mouseX = e.x;
}

// Determines which column to hover after the animation completes (if any)
function addHoverByMousePos(col) {
    if (mouseX) {
        col = Math.floor((mouseX - innerBoard.getBoundingClientRect().left) / cellSize)
    }
    if (game.isValid(col) && mouseX - cellElements[col].getBoundingClientRect().left < cellSize) {
        const currentClass = game.yTurn ? Y : R;
        const row = game.empty[col] + 1
        cellElements[col].classList.add(currentClass);
        cellElements[(7 * row) + col].classList.add(currentClass, "hovering");
    }
    mouseX = null;
}

function endGame(draw, combo) {
    const currentClass = game.yTurn ? Y : R;

    disableCells();
    for (let i = 0; i < 7; i++) cellElements[i].classList.remove(currentClass);
    game.empty.forEach((row, col) => {
        cellElements[(7 * (row + 1)) + col].classList.remove("yellow", "red", "hovering");
    });

    if (draw) {
        winningMsgTextElement.textContent = `Draw!`
        buttonsTxt.textContent = "Play again:"
        winningMsgElement.classList.add('show');
        window.removeEventListener("mousemove", mouseMove);
    } else {
        let comboElement = createCombo(combo);
        innerBoard.insertBefore(comboElement, winningMsgElement);
        winningMsgTextElement.textContent = `${game.yTurn ? "Red" : "Yellow"} Wins!`
        buttonsTxt.textContent = "Play again:"
        setTimeout(() => {
            winningMsgElement.classList.add('show');
            window.removeEventListener("mousemove", mouseMove);
        }, 1000);
    }
}

function createCombo(combo) {
    let comboElement = document.createElement("div");
    comboElement.classList.add("c4-combo");

    if (combo.type === "col") {
        comboElement.style.width = `${cellSize * .15}px`
        comboElement.style.height = `${cellSize * combo.combo.length}px`
        comboElement.animate(
            [{ height: "0px" }, { height: `${cellSize * combo.combo.length}px` }], 
            { duration: 250 }
        );

        let [row, col] = getTop(combo.combo);
        let top = cellElements[(7 * (row + 1)) + col].offsetTop;
        let left = cellElements[(7 * (row + 1)) + col].offsetLeft;
        comboElement.style.top = `${top}px`
        comboElement.style.left = `${left + cellSize * 0.425}px`
    } else if (combo.type === "row") {
        comboElement.style.width = `${cellSize * combo.combo.length}px`
        comboElement.style.height = `${cellSize * .15}px`
        comboElement.animate(
            [{ width: "0px" }, { width: `${cellSize * combo.combo.length}px` }], 
            { duration: 250 }
        );

        let [row, col] = getLeft(combo.combo);
        let top = cellElements[(7 * (row + 1)) + col].offsetTop;
        let left = cellElements[(7 * (row + 1)) + col].offsetLeft;
        comboElement.style.top = `${top + cellSize * 0.425}px`
        comboElement.style.left = `${left}px`
    } else {
        comboElement.style.width = `${cellSize * .15}px`
        let height = cellSize * combo.combo.length * 1.414
        comboElement.style.height = `${height}px`
        comboElement.style.transform = `rotate(${(combo.type === "diag1") ? -45 : 45}deg)`
        comboElement.animate(
            [{ transform: `scale(0) rotate(${(combo.type === "diag1") ? -45 : 45}deg)` }, { transform: `scale(1) rotate(${(combo.type === "diag1") ? -45 : 45}deg)` }], 
            { duration: 250 }
        );

        let [row,] = getTop(combo.combo);
        let [,col] = getLeft(combo.combo);
        let top = cellElements[(7 * (row + 1)) + col].offsetTop;
        let left = cellElements[(7 * (row + 1)) + col].offsetLeft;
        comboElement.style.top = `${top - (height - (cellSize * combo.combo.length)) / 2}px`
        comboElement.style.left = `${left + (cellSize * ((combo.combo.length / 2) - .075))}px`
    }

    return comboElement;
}

function getTop(combo) {
    let minRow = 0;
    combo.forEach(([row, ], i) => {
        if (combo[minRow][0] > row) minRow = i;
    })
    return combo[minRow];
}

function getLeft(combo) {
    let minCol = 0;
    combo.forEach(([, col], i) => {
        if (combo[minCol][1] > col) minCol = i;
    })
    return combo[minCol];
}

// Removes event listeners from cells
function disableCells() {
    cellElements.forEach(cell => {
        cell.removeEventListener('click', handleClick);
        cell.removeEventListener('mouseover', handleHover);
        cell.removeEventListener('mouseleave', handleUnHover);
    });
}

// Adds event listeners to cells
function enableCells() {
    cellElements.forEach(cell => {
        cell.addEventListener('click', handleClick);
        cell.addEventListener('mouseover', handleHover);
        cell.addEventListener('mouseleave', handleUnHover);
    });
}

window.addEventListener("resize", function() {
    cellSize = cellElements[0].offsetHeight;
});

function aiMove() {
    // Create & animate circle
    let col = game.bestMove();
    let row = game.empty[col] + 1;
    const currentClass = game.yTurn ? Y : R;

    let circle = createCircle(row, col, currentClass);
    board.insertBefore(circle, board.firstChild);

    disableCells();
    game.move(col); // Perform move on logical representation
    
    // Runs once animation finishes
    setTimeout(() => {
        board.removeChild(circle);
        enableCells();

        cellElements[(7 * row) + col].classList.add(currentClass);

        let combo = game.checkWin(col)
        if (combo) {
            endGame(false, combo);
        } else if (game.isDraw()) {
            endGame(true);
        }
    }, 250);
}