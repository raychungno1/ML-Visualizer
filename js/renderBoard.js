import { Board } from "./board.js"
import { Search } from "./search.js"

const gridSize = 30
const grid = document.querySelector(".grid")
const genMaze = document.getElementById("gen-maze")
const clear = document.getElementById("clear-btn")

const bfsBtn = document.getElementById("bfs-btn")
const dfsBtn = document.getElementById("dfs-btn")
const ucsBtn = document.getElementById("ucs-btn")

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
    console.log(Search.BFS(b))
})

dfsBtn.addEventListener("click", function() {
    console.log(Search.DFS(b))
})

ucsBtn.addEventListener("click", function() {
    console.log(Search.UCS(b))
})

function renderBoard() {
    b.HTML(grid)
}