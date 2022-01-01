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

    /** Returns true if [row, col] is in range of the board */
    isValid(row, col) {
        return 0 <= row && row < this.arr.length
            && 0 <= col && col < this.arr[0].length
    }

    /** Gets the value at [row, col] of the grid */
    get(row, col) { return (this.arr[row]) ? this.arr[row][col] : null }

    /** Sets the value at [row, col] of the grid */
    set(row, col, val) { this.arr[row][col] = val }

    iterate(func, ...args) {
        this.arr.forEach((row, i) => {
            row.forEach((cell, j) => {
                func(cell, [i, j], ...args)
            });
        });
    }
}

export { Grid }