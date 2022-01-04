class Connect4 {
    static WIDTH = 7;
    static HEIGHT = 6;

    constructor() {
        this.yTurn = true;
        this.board = []
        for (let i = 0; i < Connect4.WIDTH; i++) this.board.push(Array(Connect4.HEIGHT).fill(""));
        this.empty = Array(Connect4.WIDTH).fill(Connect4.HEIGHT - 1)
    }

    get(row, col) {
        return this.board[col][row];
    }

    successors() {
        return this.empty.reduce((arr, col, i) => {
            if (col >= 0) arr.push(i);
            return arr;
        }, []);
    }

    isValid(col) {
        return this.empty[col] >= 0;
    }

    move(col) {
        let row = this.empty[col]--;
        this.board[col][row] = (this.yTurn ? "y" : "r");
        this.swapTurns();
    }

    undo(col) {
        let row = ++this.empty[col];
        this.board[col][row] = "";
        this.swapTurns();
    }

    swapTurns() {
        this.yTurn = !this.yTurn;
    }

    checkWin(col) {
        let row = this.empty[col] + 1
        let b = this.board;

        if (!b[col] || !b[col][row]) return null;

        // Check column
        if (b[col][row] === b[col][row + 1] &&
            b[col][row + 1] === b[col][row + 2] &&
            b[col][row + 2] === b[col][row + 3]) {
            return {
                type: "col",
                combo: [[row, col], [row + 1, col], [row + 2, col], [row + 3, col]]
            };
        }

        // Check row
        let match = [[row, col]];
        let i = 1
        while (b[col - i] && (b[col - i][row] === b[col][row])) match.push([row, col - i++]);
        i = 1;
        while (b[col + i] && (b[col + i][row] === b[col][row])) match.push([row, col + i++]);
        if (match.length >= 4) return {type: "row", combo: match};

        // Check diag 1
        match = [[row, col]];
        i = 1
        while (b[col - i] && (b[col - i][row - i] === b[col][row])) match.push([row - i, col - i++]);
        i = 1;
        while (b[col + i] && (b[col + i][row + i] === b[col][row])) match.push([row + i, col + i++]);
        if (match.length >= 4) return {type: "diag1", combo: match};

        // Check diag 2
        match = [[row, col]];
        i = 1
        while (b[col - i] && (b[col - i][row + i] === b[col][row])) match.push([row + i, col - i++]);
        i = 1;
        while (b[col + i] && (b[col + i][row - i] === b[col][row])) match.push([row - i, col + i++]);
        if (match.length >= 4) return {type: "diag2", combo: match};

        return null;
    }

    print() {
        let out = Array(Connect4.HEIGHT).fill("");
        this.board.forEach(col => {
            col.forEach((cell, i) => {
                out[i] += cell || "-";
                if (i !== Connect4.WIDTH - 1) out[i] += " "
            });
        });
        console.log(out.join("\n"));
    }
}

export { Connect4 }
