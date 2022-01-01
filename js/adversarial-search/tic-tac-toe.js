import { Grid } from "../grid.js"

class TicTacToe {
    
    /** Initializes a new Tic-Tac-Toe game */
    constructor() {
        // if turn is 0, it is X's turn
        // if turn is 1, it is O's turn
        this.board = new Grid(3, 3, "");
        this.moves = [];
        this.turn = 0;
        this.grid = document.getElementById("grid")
    }

    /** Returns a list of available moves */
    successors() {
        let successors = []

        this.board.arr.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (!cell) successors.push([i, j])
            });
        });

        return successors;
    }

    /**
     * If a move is valid, makes it and returns the winning player & combo (if any)
     * @param {Array} coords location to place [row, col]
     * @returns null or an object with the following properties:
     * {
     *  player: the winning player,
     *  combo: an array of the winning configuration
     * }
     */
    move(coords) {
        if (this.board.isValid(...coords) && !this.board.get(...coords)) {
            let val = this.turn ? "O" : "X";
            
            this.board.set(...coords, val);
            this.moves.push(coords);
            this.turn = 1 - this.turn;
            
            let combo = this.getWinner(coords);
            if (combo) {
                return {
                    player: val,
                    combo: combo
                };
            } else if (this.moves.length === 9) {
                return {};
            }
        } else {
            console.log("invald placement")
        }
        return null;
    }

    /** Undos the most recent move */
    undo() {
        let move = this.moves.pop();
        this.board.set(...move, "");
        return move;
    }

    /** Checks the board for a win */
    getWinner([row, col]) {
        if (this.checkRow(row)) return [[row, 0], [row, 1], [row, 2]];
        if (this.checkCol(col)) return [[0, col], [1, col], [2, col]];
        if (this.checkDiag1())  return [[0, 0], [1, 1], [2, 2]];
        if (this.checkDiag2())  return [[0, 2], [1, 1], [2, 0]];
        return null;
    }

    /** Checks a specific row for a win */
    checkRow(row) {
        let b = this.board;
        return b.get(row, 0) && b.get(row, 0) === b.get(row, 1) && b.get(row, 1) === b.get(row, 2);
    }

    /** Checks a specific col for a win */
    checkCol(col) {
        let b = this.board;
        return b.get(0, col) && b.get(0, col) === b.get(1, col) && b.get(1, col) === b.get(2, col);
    }

    /** Checks a the diagonal from the upper left to the lower right for a win */
    checkDiag1() {
        let b = this.board;
        return b.get(0, 0) && b.get(0, 0) === b.get(1, 1) && b.get(1, 1) === b.get(2, 2);
    }
    
    /** Checks a the diagonal from the upper right to the lower left for a win */
    checkDiag2() {
        let b = this.board;
        return b.get(0, 2) && b.get(0, 2) === b.get(1, 1) && b.get(1, 1) === b.get(2, 0);
    }

    /** Prints a represnetation of the board to the console */
    print() {
        this.board.arr.forEach((row, i) => {
            let out = "";
            row.forEach((cell, j) => {
                out += ` ${cell || " "} ${(j < 2) ? "|" : ""}`;
            });
            console.log(out);
            if (i < 2) console.log("---+---+---");
        });
    }

    /** Renders the board to an HTML table & manages their event listeners */
    render() {
        for (let i = 0, row; row = this.grid.rows[i]; i++) {
            for (let j = 0, cell; cell = row.cells[j]; j++) {

                let divEl = cell.children[0];
                divEl.game = this
                divEl.i = i;
                divEl.j = j;

                let symbol = this.board.get(i, j);
                if (symbol) {
                    divEl.classList.add(symbol)
                    divEl.removeEventListener("click", this.playerMove);
                    divEl.removeEventListener("mouseleave", this.removeHover);
                    divEl.removeEventListener("mouseover", this.hover);

                    cell.style.removeProperty("background-color")
                    cell.style.removeProperty("outline")
                    cell.style.removeProperty("outline-offset")
                    continue;
                }
                divEl.addEventListener("click", this.playerMove);
                divEl.addEventListener("mouseover", this.hover);
                divEl.addEventListener("mouseleave", this.removeHover);
            }
        }
    }

    /* Perform a player move followed by an ai move */
    playerMove(e) {
        let el = e.currentTarget;
        let game = e.currentTarget.game;

        let results = game.move([el.i, el.j]);
        game.render();
        
        if (results) {
            game.endGame(results);
        } else {
            game.aiMove();
        }
    }

    /** Selects an ai move & performs it */
    aiMove() {
        let successors = this.successors();
        let results = this.move(successors[0]);
        this.render();

        if (results) this.endGame(results)
    }

    /** Ends the game (removes event listeners & displays output) */
    endGame(results) {
        for (let i = 0, row; row = this.grid.rows[i]; i++) {
            for (let j = 0, cell; cell = row.cells[j]; j++) {
                let divEl = cell.children[0];
                divEl.removeEventListener("click", this.playerMove);
            }
        }
        console.log(results);
    }

    /** mouesover effects for empty cells */
    hover(e) {
        let el = e.currentTarget.parentNode;
        el.style.backgroundColor = "rgb(194, 194, 194)";
        el.style.outline = "5px dotted gray";
        el.style.outlineOffset = "-5px";
    }
    
    /** mouseleave effects for empty cells */
    removeHover(e) {
        let el = e.currentTarget.parentNode;
        el.style.removeProperty("background-color")
        el.style.removeProperty("outline")
        el.style.removeProperty("outline-offset")
    }

}

export { TicTacToe }
