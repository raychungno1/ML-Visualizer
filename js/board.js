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
        arrShuffle(["n", "s", "e", "w"]).forEach(element => {

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
    renderGrid(grid) {
        let output = ""
        this.env.forEach((row, i) => {
            output += "<tr>"
            row.forEach((cell, j) => {

                output += "<td class=\""
                if (!cell[0] || i === 0)                output += "north "
                if (!cell[1] || i === this.rows - 1)    output += "south "
                if (!cell[2] || j === this.cols - 1)    output += "east "
                if (!cell[3] || j === 0)                output += "west "
                output += `" id="r${i}c${j}">`
                if (arrEquals(this.startState, [i, j])) output += `<div class="icon start-icon"></div>`
                if (arrEquals(this.goalState, [i, j])) output += `<div class="icon goal-icon"></div>`
                output += "</td>"
            })
            output += "</tr>"
        })
        grid.innerHTML = output
    }

    static addClass(grid, path, costs, expansion, nodeCount, totalCost, start, i) {
        if (i < expansion.length) {
            let [row, col] = expansion[i]
            grid.rows[row].cells[col].classList.add("expansion")
        } else if (i === expansion.length) {
            grid.rows[start[0]].cells[start[1]].classList.add("solution")
        } else {
            [start[0], start[1]] = Directions[path[i-expansion.length-1]].update(start)
            grid.rows[start[0]].cells[start[1]].classList.add("solution")
        }

        let cost = 0
        for (let k = 0; k < costs.length; k++) {
            cost += costs[k]
        }
        totalCost.textContent = `Cost: ${cost}`
        nodeCount.textContent = `Nodes Searched: ${expansion.length - 1}`
    }

    static animateClass(grid, path, costs, expansion, nodeCount, totalCost, start, i) {
        if (i < expansion.length) {
            let [row, col] = expansion[i]
            gsap.fromTo(`#r${row}c${col}`, {scale: 0}, {scale: 1, backgroundColor: "rgba(255, 128, 128, .5)", duration: 1, ease: "elastic.out(1, 1)"})
            
            totalCost.textContent = `Cost: 0`
            nodeCount.textContent = `Nodes Searched: ${i}`
        } else if (i === expansion.length) {
            let [row, col] = start
            const tl = gsap.timeline({defaults: {duration: 1, ease: "power4.out"}})
            tl.fromTo(`#r${row}c${col}`, {scale: 1}, {scale: .5})
            tl.fromTo(`#r${row}c${col}`, {scale: .5, backgroundColor: "rgba(255, 128, 128, .5)"}, {scale: 1, backgroundColor: "rgba(255, 0, 0, .5)", duration: 1, ease: "elastic.out(1, 0.5)"}, "<15%")
        } else {
            [start[0], start[1]] = Directions[path[i-expansion.length-1]].update(start)
            let [row, col] = start
            const tl = gsap.timeline({defaults: {duration: 1, ease: "power4.out"}})
            tl.fromTo(`#r${row}c${col}`, {scale: 1}, {scale: .5})
            tl.fromTo(`#r${row}c${col}`, {scale: .5, backgroundColor: "rgba(255, 128, 128, .5)"}, {scale: 1, backgroundColor: "rgba(255, 0, 0, .5)", duration: 1, ease: "elastic.out(1, 0.5)"}, "<15%")

            let cost = 0
            for (let k = 0; k < i-expansion.length; k++) {
                cost += costs[k]
            }
            setTimeout(() => {
                totalCost.textContent = `Cost: ${cost}`
            }, (i-expansion.length))

        }
    }

    renderPath(grid, path, costs, expansion, nodeCount, totalCost, animate=false, duration=2000) {
        let start = [...this.startState]
        for (let i = 0; i <= expansion.length + path.length; i++) {
            if (animate) {
                setTimeout(function () {
                    Board.animateClass(grid, path, costs, expansion, nodeCount, totalCost, start, i)
                }, 10 * i /*/ (expansion.length + path.length)*/);
            } else {
                Board.addClass(grid, path, costs, expansion, nodeCount, totalCost, start, i)
            }
        }
    }
}

export { Board }
