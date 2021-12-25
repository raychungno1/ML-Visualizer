import { arrEquals } from "./array.js"
import { Board } from "./board.js"
import { Search } from "./search.js"

// DOM elements & constants
const gridSize = 30
const grid = document.getElementById("grid")
const btn = {
    genMaze: document.getElementById("gen-maze"),
    clear: document.getElementById  ("clear-btn"),
    bfs: document.getElementById    ("bfs-btn"),
    dfs: document.getElementById    ("dfs-btn"),
    ucs: document.getElementById    ("ucs-btn"),
    greedy: document.getElementById ("greedy-btn"),
    aStar: document.getElementById  ("a-star-btn")
}

// Initial board setup (when loading website)
let recentAlg, rows, cols, b, start, goal
let startEl, goalEl, dragEl, isDragging, placeholder
var mouse = {
    x: null,
    y: null
}
setup(false)

// Setup buttons
window.addEventListener(        "resize",() => setup(false))
btn.genMaze.addEventListener(   "click", () => setup(true))
btn.clear.addEventListener(     "click", () => setup(false))
btn.bfs.addEventListener(       "click", () => recentAlg = runBFS(b, true))
btn.dfs.addEventListener(       "click", () => recentAlg = runDFS(b, true))
btn.ucs.addEventListener(       "click", () => recentAlg = runUCS(b, true))
btn.greedy.addEventListener(    "click", () => recentAlg = runGreedy(b, true))
btn.aStar.addEventListener(     "click", () => recentAlg = runAStar(b, true))

/**
 * Set up the board
 * @param {boolean} genMaze if true, will generate a maze
 */
function setup(genMaze) {
    // Reset text
    document.getElementById("alg-type").textContent = "Algorithm: ---"
    document.getElementById("node-count").textContent = "Nodes Searched: 0"
    document.getElementById("total-cost").textContent = "Total Cost: 0"
    recentAlg = null

    // Calculate board dimensions
    rows = Math.round(window.innerHeight * 0.6 / gridSize)
    cols = Math.round(grid.offsetWidth / gridSize)

    if (genMaze) { // Optional maze generation
        b.generateMaze()
    } else { // Set new board
        b = new Board(rows, cols)
    }
    b.renderGrid(grid) // Render board
    
    start = b.startState
    startEl = grid.rows[start[0]].cells[start[1]].firstChild
    startEl.addEventListener('mousedown', mouseDownHandler)
    
    goal = b.goalState
    goalEl = grid.rows[goal[0]].cells[goal[1]].firstChild
    goalEl.addEventListener('mousedown', mouseDownHandler)
}

function mouseDownHandler(e) {
    // set dragging target
    dragEl = e.target

    // Calculate the mouse position
    const rect = dragEl.getBoundingClientRect()
    mouse.x = e.pageX - rect.left
    mouse.y = e.pageY - rect.top

    // Attach the listeners to document
    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
}

function mouseMoveHandler(e) {
    const dragRect = dragEl.getBoundingClientRect()
    const parentRect = dragEl.parentNode.getBoundingClientRect()

    if (!isDragging) {
        isDragging = true

        // Add a placeholder element
        placeholder = document.createElement('div')
        placeholder.className = (dragEl === startEl) ? "icon start-placeholder" : "icon goal-placeholder"
        dragEl.parentNode.insertBefore(placeholder, dragEl)
    }

    // Set position for dragging element
    dragEl.style.transform = "none"
    dragEl.style.top = `${e.pageY - mouse.y - parentRect.top}px`;
    dragEl.style.left = `${e.pageX - mouse.x - parentRect.left}px`;

    // Determine the currently hovering cell & move the divs to that cell
    let hoverCell = closestCell(dragEl, grid)
    move(placeholder, grid, hoverCell)
    move(dragEl, grid, hoverCell)

    let rerender = false // Check if we need to rerender
    if (dragEl === startEl && !arrEquals(b.startState, hoverCell)) {
        b.startState = hoverCell
        rerender = true
    }

    // Check if we need to rerender
    if (dragEl === goalEl && !arrEquals(b.goalState, hoverCell)) {
        b.goalState = hoverCell
        rerender = true
    }

    // Rerendering paths
    if (rerender) {
        if (recentAlg === "BFS")         runBFS(b, false)
        else if (recentAlg === "DFS")    runDFS(b, false)
        else if (recentAlg === "UCS")    runUCS(b, false)
        else if (recentAlg === "Greedy") runGreedy(b, false)
        else if (recentAlg === "A*")     runAStar(b, false)
        console.log(rerender)
    }
}

// Get the closest cell
function closestCell(drag, grid) {
    // Get the bounding rectangle of elements
    const dragRect = drag.getBoundingClientRect()
    const gridRect = grid.getBoundingClientRect()
    let row = Math.round((dragRect.top - gridRect.top) / 30)
    if (row < 0) row = 0
    if (row >= b.rows) row = b.rows - 1
    
    let col = Math.round((dragRect.left - gridRect.left) / 30)
    if (col < 0) col = 0
    if (col >= b.cols) col = b.cols - 1

    return [row, col]
}

function move(node, grid, loc) {
    let oldCell = node.parentNode
    let newCell = grid.rows[loc[0]].cells[loc[1]]

    oldCell.removeChild(node)
    newCell.appendChild(node)
}

const mouseUpHandler = function () {

    // Remove the placeholder
    if (placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);

    dragEl.style.removeProperty('top');
    dragEl.style.removeProperty('left');
    dragEl.style.removeProperty('transform');
    dragEl.style.removeProperty('position');

    mouse.x = null
    mouse.y = null
    dragEl = null
    isDragging = false

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
}

// Runs & renders BFS
function runBFS (b, animate) {
    const solution = Search.BFS(b)
    renderResult(b, "BFS", solution, animate)
    return "BFS"
}

// Runs & renders DFS
function runDFS(b, animate) {
    const solution = Search.DFS(b)
    renderResult(b, "DFS", solution, animate)
    return "DFS"
}

// Runs & renders UCS
function runUCS(b, animate) {
    const solution = Search.UCS(b)
    renderResult(b, "UCS", solution, animate)
    return "UCS"
}

// Runs & renders Greedy Search
function runGreedy(b, animate) {
    const solution = Search.greedy(b)
    renderResult(b, "Greedy", solution, animate)
    return "Greedy"
}

// Runs & renders A* Search
function runAStar(b, animate) {
    const solution = Search.aStar(b)
    renderResult(b, "A*", solution, animate)
    return "A*"
}

// Render the result from a search algorithm
function renderResult(b, algType, solution, animate) {
    const grid = document.getElementById("grid")
    const algTxt = document.getElementById("alg-type")
    const nodeCountTxt = document.getElementById("node-count")
    const totalCostTxt = document.getElementById("total-cost")
    const btn = document.querySelectorAll("button")

    algTxt.textContent = `Algorithm: ${algType}`
    b.clearPath(grid)
    b.renderPath(grid, ...solution, nodeCountTxt, totalCostTxt, animate)
    
    // Disable buttons until animation finishes
    if (animate) {
        startEl.removeEventListener('mousedown', mouseDownHandler)
        goalEl.removeEventListener('mousedown', mouseDownHandler)
        btn.forEach(b => b.disabled = true)
        setTimeout(() => {
            startEl.addEventListener('mousedown', mouseDownHandler)
            goalEl.addEventListener('mousedown', mouseDownHandler)
            btn.forEach(b => b.disabled = false)
        }, 10.5 * (solution[0].length + solution[2].length))
    }
}
