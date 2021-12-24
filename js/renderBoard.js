import { Board } from "./board.js"
import { Search } from "./search.js"

const gridSize = 30
const grid = document.querySelector(".grid")
const genMaze = document.getElementById("gen-maze")
const clear = document.getElementById("clear-btn")

const bfsBtn = document.getElementById("bfs-btn")
const dfsBtn = document.getElementById("dfs-btn")
const ucsBtn = document.getElementById("ucs-btn")

const algType = document.getElementById("alg-type")
const nodeCountTxt = document.getElementById("node-count")
const totalCostTxt = document.getElementById("total-cost")

let rows = Math.round(window.innerHeight * 0.6 / gridSize)
let cols = Math.round(grid.offsetWidth / gridSize)
let b = new Board(rows, cols)
renderBoard()

window.addEventListener("resize", function() {
    rows = Math.round(window.innerHeight * 0.6 / gridSize)
    cols = Math.round(grid.offsetWidth / gridSize)
    b = new Board(rows, cols)
    renderBoard()
})

genMaze.addEventListener("click", function() {
    b.generateMaze()
    renderBoard()
})

clear.addEventListener("click", function() {
    b = new Board(rows, cols)
    renderBoard()
})

bfsBtn.addEventListener("click", function() {
    const [directions, totalCost, expansion] = Search.BFS(b)
    renderResult("BFS", totalCost, directions, expansion, true)
})

dfsBtn.addEventListener("click", function() {
    const [directions, totalCost, expansion] = Search.DFS(b)
    renderResult("DFS", totalCost, directions, expansion, true)
})

ucsBtn.addEventListener("click", function() {
    const [directions, totalCost, expansion] = Search.UCS(b)
    renderResult("UCS", totalCost, directions, expansion, true)
})

function renderResult(alg, costs, directions, expansion, animate = false) {
    algType.textContent = `Algorithm: ${alg}`
    b.renderGrid(grid)
    b.renderPath(grid, directions, costs, expansion, nodeCountTxt, totalCostTxt, animate)

    if (animate) {
        genMaze.disabled = true;
        clear.disabled = true;
        bfsBtn.disabled = true;
        dfsBtn.disabled = true;
        ucsBtn.disabled = true;
        setTimeout(() => {
            genMaze.disabled = false;
            clear.disabled = false;
            bfsBtn.disabled = false;
            dfsBtn.disabled = false;
            ucsBtn.disabled = false;
        }, 10.5 * (expansion.length + directions.length))
    }
}

function renderBoard() {
    b.renderGrid(grid)
}