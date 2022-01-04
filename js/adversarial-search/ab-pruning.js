import { Connect4 } from "./connect4.js"

const Y = "yellow"
const R = "red"
const cellElements = document.querySelectorAll('[data-cell]');
let cellSize = cellElements[0].offsetHeight;
const board = document.getElementById('board');

let game = new Connect4();

var mouseX;

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
        enableCells();

        cellElements[(7 * row) + col].classList.add(currentClass);
        
        window.removeEventListener("mousemove", mouseMove);
        addHoverByMousePos(col);

        let combo = game.checkWin(col)
        if (combo) {
            console.log(`${game.yTurn ? "Red" : "Yellow"} Wins!`)
            console.log(combo);
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
        col = Math.floor((mouseX - document.getElementById("inner-board").getBoundingClientRect().left) / cellSize)
    }
    if (game.isValid(col) && mouseX - cellElements[col].getBoundingClientRect().left < cellSize) {
        const currentClass = game.yTurn ? Y : R;
        const row = game.empty[col] + 1
        cellElements[col].classList.add(currentClass);
        cellElements[(7 * row) + col].classList.add(currentClass, "hovering");
    }
    mouseX = null;
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
