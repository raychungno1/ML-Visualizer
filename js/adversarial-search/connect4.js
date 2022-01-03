const R = "red"
const Y = "yellow"
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');

let game = ["", "", "", "", "", "", "", "", ""];
let redTurn;

redTurn = true;
cellElements.forEach(cell => {
    // cell.classList.remove(R);
    // cell.classList.remove(Y);
    // cell.removeEventListener('click', handleClick);
    // cell.addEventListener('click', handleClick);
    cell.removeEventListener('mouseover', handleHover);
    cell.addEventListener('mouseover', handleHover);
    cell.removeEventListener('mouseleave', handleUnHover);
    cell.addEventListener('mouseleave', handleUnHover);
});

function handleHover(e) {
    const cell = e.target;
    const currentClass = redTurn ? R : Y;
    let col = [...cellElements].indexOf(cell) % 7;
    cellElements[col].classList.add(currentClass);

    let row = 6;
    while (row && (cellElements[7 * row + col].classList.contains(R) ||
        cellElements[7 * row + col].classList.contains(Y))) {
        row--;
    }
    cellElements[7 * row + col].classList.add(currentClass);
    cellElements[7 * row + col].classList.add("hovering");
}

function handleUnHover(e) {
    const cell = e.target;
    const currentClass = redTurn ? R : Y;
    let col = [...cellElements].indexOf(cell) % 7;
    cellElements[col].classList.remove(currentClass);

    let row = 6;
    while (row && (cellElements[7 * row + col].classList.contains(R) ||
        cellElements[7 * row + col].classList.contains(Y)) &&
        !cellElements[7 * row + col].classList.contains("hovering")) {
        row--;
    }
    cellElements[7 * row + col].classList.remove(currentClass);
    cellElements[7 * row + col].classList.remove("hovering");
}