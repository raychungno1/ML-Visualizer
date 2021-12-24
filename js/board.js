import { Directions } from "./directions.js"
import { arrShuffle, arrEquals } from "./array.js"

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
                row.push([1, 1, 1, 1])
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
        // Compares state to dimensions
        return 0 <= state[0] && state[0] < this.rows &&
            0 <= state[1] && state[1] < this.cols
    }

    /**
     * Wrapper function to generate a maze using Recursive Backtracking
     */
    generateMaze() {
        // First add walls on every individual cell
        this.env.forEach(row => {
            row.forEach(cell => {
                for (let i = 0; i < cell.length; i++) cell[i] = 0
            })
        })

        // Then carve out the maze recursively
        this.carve_passages(this.startState)
    }

    /**
     * Recursively generates a maze using Recursive Backtracking
     * @param {Array} state the starting location
     */
    carve_passages(state) {
        // For each direction (randomly chosen)
        arrShuffle(["N", "S", "E", "W"]).forEach(element => {

            // Get the associated direction & state
            const dir = Directions[element]
            const newState = dir.update(state)

            // If new state is valid & that cell hasn't been visited yet
            if (this.inRange(newState) &&
                arrEquals(this.env[newState[0]][newState[1]], [0, 0, 0, 0])) {

                // Break the "walls" to create a path
                this.env[state[0]][state[1]][dir.index] = 1
                this.env[newState[0]][newState[1]][dir.oppositeIndex] = 1

                // Recursive call on the new cell
                this.carve_passages(newState)
            }
        });
    }

    /**
     * Gets value at location
     * @param {Array} state     location to get value
     * @returns {number}        value at state
     */
    getValue(state) { return this.env[state[0]][state[1]] }

    /**
     * Checks for a goal state
     * @param {Array} state     location to check state [row, col]
     * @returns {boolean}       true if state is a valid goal state
     */
    isGoal(state) { return arrEquals(this.goalState, state) }
 
    /**
     * Returns successors for a given state
     * @param {Array} state     location to check successors [row, col]
     * @returns {Array}         list of valid successors [successor, action, cost]
     * 
     * successor    resulting state [row, col]
     * action       action required to get there ("n", "s", "e", "w")
     * cost         cost to get there
     */
    successors(state) {
        // Get the walls at a given state
        let walls = this.getValue(state)

        // Check each direction for valid successor
        let successors = []
        if (walls[0] && state[0] > 0)               successors.push([[state[0] - 1, state[1]], "n", 1])
        if (walls[1] && state[0] < this.rows - 1)   successors.push([[state[0] + 1, state[1]], "s", 1])
        if (walls[2] && state[1] < this.cols - 1)   successors.push([[state[0], state[1] + 1], "e", 1])
        if (walls[3] && state[1] > 0)               successors.push([[state[0], state[1] - 1], "w", 1])

        // Output
        return successors 
    }

    /**
     * Prints an ASCII representation of the board
     */
    print() {
        console.log(" " + "_".repeat(this.cols * 2 - 1))
        this.env.forEach((row, i) => {
            let rowStr = "|"
            row.forEach((cell, j) => {
                rowStr += `${(cell[1] === 0 || i === this.rows - 1) ? "_" : " "}`
                if (cell[2] === 0 || j === this.cols - 1){
                    rowStr += "|"
                } else {
                    rowStr += `${(i === this.rows - 1) ? "_" : " "}`
                }
            })
            console.log(rowStr)
        })
    }

    /**
     * Returns an HTML formatted representation of the board
     */
    HTML(grid) {
        let output = ""
        this.env.forEach((row, i) => {
            output += "<tr>"
            row.forEach((cell, j) => {

                output += "<td class=\""
                if (!cell[0] || i === 0)                output += "north "
                if (!cell[1] || i === this.rows - 1)    output += "south "
                if (!cell[2] || j === this.cols - 1)    output += "east "
                if (!cell[3] || j === 0)                output += "west "
                output += "\">"

                if (arrEquals(this.startState, [i, j])) output += `<div class="icon start-icon"></div>`
                if (arrEquals(this.goalState, [i, j])) output += `<div class="icon goal-icon"></div>`
                output += "</td>"
            })
            output += "</tr>"
        })
        grid.innerHTML = output
    }

    // animateWalls(grid) {
    //     let startState = this.startState
    //     let goalState = this.goalState
    //     grid.innerHTML = `<tr>${"<td></td>".repeat(this.cols)}</tr>`.repeat(this.rows)
    //     this.env.forEach((row, i) => {
    //         (function (i) { setTimeout(function () {
    //             row.forEach((cell, j) => {
    //                 (function (j) { setTimeout(function () {
    //                     let gridCell = grid.rows[i].cells[j]
    //                     if (cell[0]) {
    //                         // Board.borderAnimation(gridCell, "Top")
    //                         gridCell.classList.add("north")
    //                     }
    //                     if (cell[1]) {
    //                         gridCell.classList.add("south")
    //                         // Board.borderAnimation(gridCell, "Bottom")
    //                     }
    //                     if (cell[2]) {
    //                         gridCell.classList.add("east")
    //                         // Board.borderAnimation(gridCell, "Right")
    //                     }
    //                     if (cell[3]) {
    //                         gridCell.classList.add("west")
    //                         // Board.borderAnimation(gridCell, "Left")
    //                     }
    //                     if (arrEquals(startState, [i, j])) {
    //                         console.log("start")
    //                         gridCell.innerHTML = `<div class="start-icon"></div>`
    //                     } 
    //                     if (arrEquals(goalState, [i, j])) gridCell.innerHTML = `<div class="goal-icon"></div>`
    //                 }, (5 * j)); })(j);
    //             })
    //         }, (5 * i)); })(i);
    //     })    
    // }
}

export { Board }
