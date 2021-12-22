class State {
    /**
     * Initializes a state with a row & column
     * @param {number} row      row of a location
     * @param {number} col   column of a location
     */
    constructor(row, col) { this.row = row, this.col = col }

    /**
     * Checks equality of two states
     * @param {State} state 
     * @returns true if states are equal
     */
    equals(state) { return (this.row === state.row) && (this.col === state.col) }

    /**
     * Returns the state to the north of the current state
     */
    north() { return new State(this.row--, this.col) }
    
    /**
     * Returns the state to the north of the current state
     */
    south() { return new State(this.row++, this.col) }

    /**
     * Returns the state to the east of the current state
     */
    east() { return new State(this.row, this.col++) }

    /**
     * Returns the state to the west of the current state
     */
    west() { return new State(this.row, this.col--) }
}

/**
 * Wrapper function to initialize & return a new state
 */
function state(row, col) { return new State(row, col) }

class Environment {
    
    /**
     * Initializes an environment with a set size, start state, and goal state
     * @param {number} rows         environment height
     * @param {number} columns      environment width
     * @param {State} startState    location of start state
     * @param {State} goalState     location of goal state
     */
    constructor(rows, columns, startState, goalState) {
        // Initialize playing field (a 2d array)
        this.rows = rows
        this.columns = columns
        this.env = new Array(rows)
        for (let i = 0; i < rows; i++) this.env[i] = new Array(columns).fill(0)

        // Initialize startState & goalState
        this.startState = startState
        this.goalState = goalState
    }

    /**
     * Sets the value at state equal to val
     * @param {State} state     location to set value
     * @param {number} val      value
     */
    setValue(state, val) { this.env[state.row][state.col] = val }

    /**
     * Gets value at location
     * @param {State} state     location to get value
     * @returns {number}        value at state
     */
    getValue(state) { return this.env[state.row][state.col] }

    /**
     * Checks for a goal state
     * @param {State} state     location to check state [row, col]
     * @returns {boolean}       true if state is a valid goal state
     */
    isGoalState(state) { return this.goalState.equals(state) }

    /**
     * Returns successors for a given state
     * @param {State} state     location to check successors [row, col]
     * @returns {Array}         list of valid successors [successor, action, cost]
     * 
     * successor    resulting state
     * action       action required to get there ("n", "s", "e", "w")
     * cost         cost to get there
     */
    successors(state) {
        // Check each direction for valid successor
        let successors = []
        if (this.north(state) === 0)    successors.push([state.north(), "n", 1])
        if (this.south(state) === 0)    successors.push([state.south(), "s", 1])
        if (this.east(state) === 0)     successors.push([state.east(), "e", 1])
        if (this.west(state) === 0)     successors.push([state.left(), "w", 1])

        // Output
        return successors 
    }

    /**
     * Returns the value to the north of state, null if out of bounds
     */
    north(state) { return (state.row > 0) ? this.getValue(state.north()) : null }

    /**
     * Returns the value to the south of state, null if out of bounds
     */
    south(state) { return (state.row < this.rows - 1) ? this.getValue(state.south()) : null }

    /**
     * Returns the value to the east of state, null if out of bounds
     */
    east(state) { return (state.col < this.columns - 1) ? this.getValue(state.east()) : null }

    /**
     * Returns the value to the west of state, null if out of bounds
     */
    west(state) { return (state.col > 0) ? this.getValue(state.west()) : null }
}

let board = new Environment(5, 6, state(2, 1), state(2, 4))
board.setValue(state(2, 1), 1)
board.setValue(state(2, 4), 1)
console.log(board)

console.log(board.isGoalState(state(2, 4)))

let successors = board.successors(state(2, 2))
console.log(successors)


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
async function alterMap() {
    board.setValue([2, 1], 0)
    await sleep(500);
    console.log(board.env)
    board.setValue([2, 4], 0)
    await sleep(500);
    console.log(board.env)
}

// alterMap()