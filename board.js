import { Directions } from "./directions.js"
import { shuffle, equals } from "./array.js"

class Board {

    /**
     * Initializes an environment with a set size, start state, and goal state
     * @param {number} rows         environment height
     * @param {number} columns      environment width
     * @param {State} startState    location of start state
     * @param {State} goalState     location of goal state
     */
    constructor(rows, cols, startState = [0, 0], goalState = [rows - 1, cols - 1]) {
        // Save dimensions
        this.rows = rows
        this.cols = cols
         
        // Initialize playing field (a 2d array)
        this.env = []
        for (let i = 0; i < rows; i++) {
            let row = []
            for (let j = 0; j < cols; j++) {
                row.push([0, 0, 0, 0])
            }
            this.env.push(row)
        }
        // Initialize startState & goalState
        this.startState = startState
        this.goalState = goalState
    }

    /**
     * Checks if a state [row, col] is a valid position on the board
     * @returns true if the state is valid
     */
    inRange(state) {
        return 0 <= state[0] && state[0] < this.rows &&
            0 <= state[1] && state[1] < this.cols
    }

    /**
     * Wrapper function to generate a maze using Recursive Backtracking
     */
    generateMaze() {
        this.env.forEach(row => {
            row.forEach(cell => {
                for (let i = 0; i < cell.length; i++) cell[i] = 1
            })
        })
        this.carve_passages(this.startState)
    }

    /**
     * Recursively generates a maze using Recursive Backtracking
     * @param {Array} state the starting location
     */
    carve_passages(state) {
        shuffle(["N", "S", "E", "W"]).forEach(element => {
            const dir = Directions[element]
            const newState = dir.update(state)
            if (this.inRange(newState) &&
                equals(this.env[newState[0]][newState[1]], [1, 1, 1, 1])) {

                this.env[state[0]][state[1]][dir.index] = 0
                this.env[newState[0]][newState[1]][dir.oppositeIndex] = 0

                this.carve_passages(newState)
            }
        });
    }

    /**
     * Prints an ASCII representation of the board
     */
    print() {
        console.log(" " + "_".repeat(this.cols * 2 - 1))
        this.env.forEach((row, i) => {
            let rowStr = "|"
            row.forEach((cell, j) => {
                rowStr += `${(cell[1] === 1 || i === this.rows - 1) ? "_" : " "}`
                if (cell[2] === 1 || j === this.cols - 1){
                    rowStr += "|"
                } else {
                    rowStr += `${(i === this.rows - 1) ? "_" : " "}`
                }
            })
            console.log(rowStr)
        })
    }
}

// const Board = require("./board.js")
let b = new Board(10, 20)
b.generateMaze()
b.print()
