import { arrShuffle, arrEquals, cellEquals } from "./array.js"
import { Directions } from "./directions.js"
import { Grid } from "./grid.js"

class Board {

    /**
     * Initializes an board with a set size, start state, and goal state
     * @param {number} rows         environment height
     * @param {number} columns      environment width
     * @param {State} startState    location of start state
     * @param {State} goalState     location of goal state
     * 
     * Each cell in the board is an object with the format:
     * {
     *  n: cost to north cell,
     *  s: cost to south cell,
     *  e: cost to east cell,
     *  w: cost to west cell
     * }
     * A cost of 0 implies a wall in that direction)
     */
    constructor(rows, cols, startState = null, goalState = null) {
        // Save dimensions
        this.rows = rows
        this.cols = cols
         
        // Initialize playing field (a 2d array)
        this.grid = new Grid(rows, cols, {n: 1, s: 1, e: 1, w: 1})

        // Initialize startState & goalState
        this.startState = startState ? startState : [Math.floor(rows/2), Math.floor(cols / 5) - 1]
        this.goalState = goalState ? goalState : [Math.floor(rows/2), cols - Math.floor(cols / 5)]
    }

    /**
     * Checks if a state [row, col] is a valid position on the board
     * @returns true if the state is valid
     */
    inRange(row, col) {
        // Compares state to dimensions
        return 0 <= row && row < this.rows &&
            0 <= col && col < this.cols
    }

    /**
     * Wrapper function to generate a maze using Recursive Backtracking
     */
    generateMaze() {
        // First add walls on every individual cell
        this.grid = new Grid(this.rows, this.cols, {n: 0, s: 0, e: 0, w: 0})

        // Then carve out the maze recursively
        this.carve_passages(this.startState)

        for (let i = 0; i < this.rows * this.cols / 2; i++) {
            const row = Math.floor(Math.random() * this.rows)
            const col = Math.floor(Math.random() * this.cols)
            const d = Directions[arrShuffle(["n", "s", "e", "w"])[0]]
            const newState = d.update([row, col])
            if (this.inRange(...newState)) {
                this.grid.get(row, col)[d.dir] = 1
                this.grid.get(...newState)[d.opposite] = 1
            }
        }
    }

    /**
     * Recursively generates a maze using Recursive Backtracking
     * @param {Array} state the starting location
     */
    carve_passages(state) {
        // For each direction (randomly chosen)
        arrShuffle(["n", "s", "e", "w"]).forEach(element => {

            // Get the associated direction & state
            const d = Directions[element]
            const newState = d.update(state)

            // If new state is valid & that cell hasn't been visited yet
            if (this.inRange(...newState) &&
                cellEquals(this.grid.get(...newState), 0, 0, 0, 0)) {

                // Break the "walls" to create a path
                this.grid.get(...state)[d.dir] = 1
                this.grid.get(...newState)[d.opposite] = 1

                // Recursive call on the new cell
                this.carve_passages(newState)
            }
        })
    }

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
        let walls = this.grid.get(...state)

        // Check each direction for valid successor
        let successors = []
        if (walls.n && state[0] > 0)               successors.push([[state[0] - 1, state[1]], "n", walls.n])
        if (walls.s && state[0] < this.rows - 1)   successors.push([[state[0] + 1, state[1]], "s", walls.s])
        if (walls.e && state[1] < this.cols - 1)   successors.push([[state[0], state[1] + 1], "e", walls.e])
        if (walls.w && state[1] > 0)               successors.push([[state[0], state[1] - 1], "w", walls.w])

        // Output
        return successors 
    }

    /**
     * Prints an ASCII representation of the board
     */
    print() {
        console.log(" " + "_".repeat(this.cols * 2 - 1))
        this.grid.arr.forEach((row, i) => {
            let rowStr = "|"
            row.forEach((cell, j) => {
                rowStr += `${(!cell.s || i === this.rows - 1) ? "_" : " "}`
                if (!cell.e || j === this.cols - 1){
                    rowStr += "|"
                } else {
                    rowStr += `${(i === this.rows - 1) ? "_" : " "}`
                }
            })
            console.log(rowStr)
        })
    }

    /** Renders the board onto the webpage */
    renderGrid(grid) {
        let output = ""
        this.grid.arr.forEach((row, i) => {
            output += "<tr>"
            row.forEach((cell, j) => {
                output += `<td class="`
                if (!cell.n && i !== 0)                output += "north "
                if (!cell.s && i !== this.rows - 1)    output += "south "
                if (!cell.e && j !== this.cols - 1)    output += "east "
                if (!cell.w && j !== 0)                output += "west "
                output += `" id="r${i}c${j}">`
                if (arrEquals(this.startState, [i, j])) output += `<div class="icon start-icon"></div>`
                if (arrEquals(this.goalState, [i, j])) output += `<div class="icon goal-icon"></div>`
            })
            output += "</tr>"
        })
        grid.innerHTML = output
    }

    /** Renders the solution path onto the webpage (without animations) */
    static staticPath(grid, directions, costs, expansion, nodeCount, totalCost, start, i) {
        if (i < expansion.length) {
            let [row, col] = expansion[i]
            grid.rows[row].cells[col].classList.add("expansion")
        } else {
            if (i !== expansion.length) [start[0], start[1]] = Directions[directions[i-expansion.length-1]].update(start)
            grid.rows[start[0]].cells[start[1]].classList.add("solution")
        }

        let cost = 0
        for (let k = 0; k < costs.length; k++) {
            cost += costs[k]
        }
        totalCost.textContent = cost
        nodeCount.textContent = expansion.length - 1
    }

    /** Renders the solution path onto the webpage (with animations) */
    static animatePath(grid, directions, costs, expansion, nodeCount, totalCost, start, i) {
        if (i < expansion.length) {
            let [row, col] = expansion[i]
            grid.rows[row].cells[col].classList.add("expansion")
            gsap.fromTo(`#r${row}c${col}`, {scale: 0}, {scale: 1, duration: .5})
            
            totalCost.textContent = "0"
            nodeCount.textContent = i
        } else {
            if (i !== expansion.length) [start[0], start[1]] = Directions[directions[i-expansion.length-1]].update(start)
            let [row, col] = start
            const tl = gsap.timeline({defaults: {duration: .2}})
            tl.fromTo(`#r${row}c${col}`, {scale: 1}, {scale: .75})
            grid.rows[row].cells[col].classList.add("solution")
            tl.fromTo(`#r${row}c${col}`, {scale: .75, opacity: .4}, {scale: 1, opacity: 1})

            let cost = 0
            for (let k = 0; k < i-expansion.length; k++) {
                cost += costs[k]
            }
            setTimeout(() => {
                totalCost.textContent = cost
            }, (i-expansion.length))

        }
    }

    /** Wrapper function to render the solution path */
    renderPath(grid, directions, costs, expansion, nodeCount, totalCost, animate=false, duration=2000) {
        let start = [...this.startState]
        for (let i = 0; i <= expansion.length + directions.length; i++) {
            if (animate) {
                setTimeout(function () {
                    Board.animatePath(grid, directions, costs, expansion, nodeCount, totalCost, start, i)
                }, 10 * i);
            } else {
                Board.staticPath(grid, directions, costs, expansion, nodeCount, totalCost, start, i)
            }
        }
    }

    clearPath(grid) {
        for (let i = 0, row; row = grid.rows[i]; i++) {
            for (let j = 0, col; col = row.cells[j]; j++) {
                col.removeAttribute('style')
                col.classList.remove("solution")
                col.classList.remove("expansion")
            }  
        }
    }
}

export { Board }
