import { arrEquals } from "./array.js"
import { Board } from "./board.js"
import { Search } from "./search.js"

const gridSize = 30
const gridContainer = document.getElementById("grid-container")
const grid = document.getElementById("grid")
const btn = {
    genMaze: document.getElementById("gen-maze"),
    clear: document.getElementById("clear-btn"),
    bfs: document.getElementById("bfs-btn"),
    dfs: document.getElementById("dfs-btn"),
    ucs: document.getElementById("ucs-btn"),
    greedy: document.getElementById("greedy-btn"),
    aStar: document.getElementById("a-star-btn")
}

const algType = document.getElementById("alg-type")
const nodeCountTxt = document.getElementById("node-count")
const totalCostTxt = document.getElementById("total-cost")

let rows = Math.round(window.innerHeight * 0.6 / gridSize)
let cols = Math.round(grid.offsetWidth / gridSize)
let b = new Board(rows, cols)

let startNode;
let goalNode;
let draggingEle;
let hoverCell;
let mouse = {
    x: undefined,
    y: undefined
}
let recentAlg;

renderBoard()
renderNodes()

window.addEventListener("resize", function() {
    rows = Math.round(window.innerHeight * 0.6 / gridSize)
    cols = Math.round(grid.offsetWidth / gridSize)
    b = new Board(rows, cols)
    recentAlg = null
    renderBoard()
    renderNodes()
})

btn.genMaze.addEventListener("click", function() {
    algType.textContent = "Algorithm: ---"
    nodeCountTxt.textContent = "Nodes Searched: 0"
    totalCostTxt.textContent = "Total Cost: 0"
    recentAlg = null
    b.generateMaze()
    renderBoard()
})

btn.clear.addEventListener("click", function() {
    b = new Board(rows, cols)
    recentAlg = null
    renderBoard()
})

btn.bfs.addEventListener("click", () => runBFS(true))

function runBFS (animate) {
    const [directions, totalCost, expansion] = Search.BFS(b)
    recentAlg = "BFS"
    renderResult("BFS", totalCost, directions, expansion, animate)
}

btn.dfs.addEventListener("click", () => runDFS(true))

function runDFS(animate) {
    const [directions, totalCost, expansion] = Search.DFS(b)
    recentAlg = "DFS"
    renderResult("DFS", totalCost, directions, expansion, animate)
}

btn.ucs.addEventListener("click", () => runUCS(true))

function runUCS(animate) {
    const [directions, totalCost, expansion] = Search.UCS(b)
    recentAlg = "UCS"
    renderResult("UCS", totalCost, directions, expansion, animate)
}

btn.greedy.addEventListener("click", () => runGreedy(true))

function runGreedy(animate) {
    const [directions, totalCost, expansion] = Search.greedy(b)
    recentAlg = "Greedy"
    renderResult("Greedy", totalCost, directions, expansion, animate)
}

btn.aStar.addEventListener("click", () => runAStar(true))

function runAStar(animate) {
    const [directions, totalCost, expansion] = Search.aStar(b)
    recentAlg = "A*"
    renderResult("A*", totalCost, directions, expansion, animate)
}

function renderResult(alg, costs, directions, expansion, animate) {
    algType.textContent = `Algorithm: ${alg}`
    b.renderGrid(grid)
    b.renderPath(grid, directions, costs, expansion, nodeCountTxt, totalCostTxt, animate)

    // Disable buttons until animation finishes
    if (animate) {
        for (const b in btn) btn[b].disabled = true;
        startNode.removeEventListener('mousedown', mouseDownHandler);
        goalNode.removeEventListener('mousedown', mouseDownHandler);
        setTimeout(() => {
            for (const b in btn) btn[b].disabled = false;
            startNode.addEventListener('mousedown', mouseDownHandler);
            goalNode.addEventListener('mousedown', mouseDownHandler);
        }, 10.5 * (expansion.length + directions.length))
    }
}

function renderBoard() {
    b.renderGrid(grid)
}

function renderNodes() {
    let startCell = grid.rows[b.startState[0]].cells[b.startState[1]]
    let startRect = startCell.getBoundingClientRect()

    if (!startNode) {
        startNode = document.createElement('div');
        startNode.className = "icon start-icon"
        startNode.style.position = 'absolute';
        gridContainer.appendChild(startNode)
        startNode.addEventListener('mousedown', mouseDownHandler);
    }
    startNode.style.top = `${startRect.top}px`;
    startNode.style.left = `${startRect.left}px`;
    
    let goalCell = grid.rows[b.goalState[0]].cells[b.goalState[1]]
    let goalRect = goalCell.getBoundingClientRect()

    if (!goalNode) {
        goalNode = document.createElement('div');
        goalNode.className = "icon goal-icon"
        goalNode.style.position = 'absolute';
        gridContainer.appendChild(goalNode)
        goalNode.addEventListener('mousedown', mouseDownHandler);
    }
    goalNode.style.top = `${goalRect.top}px`;
    goalNode.style.left = `${goalRect.left}px`;
}

// Check if `nodeA` is above `nodeB`
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

function mouseDownHandler(e) {
    draggingEle = e.target

    // Calculate the mouse position
    const rect = draggingEle.getBoundingClientRect()
    mouse.x = e.pageX - rect.left
    mouse.y = e.pageY - rect.top

    // Attach the listeners to document
    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
}

function mouseMoveHandler(e) {
    const draggingRect = draggingEle.getBoundingClientRect()

    // Set position for dragging element
    draggingEle.style.top = `${e.pageY - mouse.y}px`
    draggingEle.style.left = `${e.pageX - mouse.x}px`

    hoverCell = closestCell(draggingEle, grid)
    if (hoverCell) {
        if (draggingEle === startNode) {
            b.startState = hoverCell
        } else if (draggingEle === goalNode) {
            b.goalState = hoverCell
        }

        switch (recentAlg) {
            case "BFS":
                runBFS(false)
                break
            case "DFS":
                runDFS(false)
                break
            case "UCS":
                runUCS(false)
                break
            case "Greedy":
                runGreedy(false)
                break
            case "A*":
                runAStar(false)
                break
        }
    }
}

const mouseUpHandler = function () {
    // Snap the div to the closest 
    // console.log(hoverCell)
    if (hoverCell) {
        let cell = grid.rows[hoverCell[0]].cells[hoverCell[1]]
        let rect = cell.getBoundingClientRect()
        draggingEle.style.top = `${rect.top}px`
        draggingEle.style.left = `${rect.left}px`
    }

    mouse.x = null
    mouse.y = null
    draggingEle = null
    hoverCell = null

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
}
