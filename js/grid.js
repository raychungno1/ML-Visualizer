class Grid {
    /**
     * Generates a grid (row * cols 2d array) initialized to copies of "value"
     * @param {number} rows 
     * @param {number} cols 
     * @param {*} value 
     * @returns a row * cols 2d array initialized to copies of "value"
     */
    constructor(rows, cols, value) {
        this.arr = []
        for (let i = 0; i < rows; i++) {
            let row = []
            for (let j = 0; j < cols; j++) {
                row.push(JSON.parse(JSON.stringify(value)));
            }
            this.arr.push(row)
        }
    }

    /** Gets the value at [row, col] of the grid */
    get(row, col) { return (this.arr[row]) ? this.arr[row][col] : null }

    /** Sets the value at [row, col] of the grid */
    set(row, col, val) { this.arr[row][col] = val }
}

export { Grid }