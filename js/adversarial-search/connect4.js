const SIZE = 42;
const WIDTH = 7;
const HEIGHT = 6;

class Connect4 {

    constructor() {
        this.yTurn = true;
        this.board = [];
        for (let i = 0; i < WIDTH; i++) this.board.push(Array(HEIGHT).fill(""));
        this.empty = Array(WIDTH).fill(HEIGHT - 1);
        this.moves = 0;
    }

    get(row, col) {
        return this.board[col][row];
    }

    successors() {
        return [3, 2, 4, 1, 5, 0, 6].filter(col => this.empty[col] >= 0)
    }

    isValid(col) {
        return this.empty[col] >= 0;
    }

    move(col) {
        let row = this.empty[col]--;
        this.board[col][row] = (this.yTurn ? "y" : "r");
        this.swapTurns();
        this.moves++;
    }

    undo(col) {
        let row = ++this.empty[col];
        this.board[col][row] = "";
        this.swapTurns();
        this.moves--;
    }

    isDraw() {
        return this.moves == 42;
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
        let out = Array(HEIGHT).fill("");
        this.board.forEach(col => {
            col.forEach((cell, i) => {
                out[i] += cell || "-";
                if (i !== WIDTH - 1) out[i] += " "
            });
        });
        console.log(out.join("\n"));
    }

    toString() {
        let out = Array(HEIGHT).fill("");
        this.board.forEach(col => {
            col.forEach((cell, i) => {
                out[i] += cell || "-";
            });
        });
        return out.join("");
    }

    bestMove() {
        let bestScore = -Infinity;
        let transpositionTable = new Map();

        let successors = this.successors()
        let bestCol = successors[0];
        let count = {c: 1};

        successors.forEach(col => {
            this.move(col);
            count.c++;
            
            let score = this.negamax(col, count);
            this.undo(col);
            
            console.log(`Col: ${col} Score: ${score}`)
            if (score > bestScore) {
                bestScore = score;
                bestCol = col;
            }
        });

        console.log(count);
        console.log(`Best Col: ${bestCol}`)
        return bestCol;
    }

    negamax(lastCol, count) {
        if (this.isDraw()) return 0;
        if (this.checkWin(lastCol)) return (SIZE - this.moves);

        let bestScore = -Infinity;
        this.successors().forEach(col => {
            this.move(col);
            bestScore = Math.max(bestScore, -this.negamax(col, count));
            this.undo(col);
            count.c++;
        });
        return bestScore;
    }

    // negamax(lastCol, alpha, beta, tt, count) {
    //     if (this.isDraw()) return 0;
    //     if (this.checkWin(lastCol)) return (WIDTH * HEIGHT + 1 - this.moves) / 2;

    //     // Upper bound of score
    //     let key = this.toString();
    //     let max = (WIDTH * HEIGHT - 1 - this.moves) / 2
    //     let val = tt.get(key);
    //     if (val) max = val - (WIDTH*HEIGHT + 1)/2;

    //     if (beta > max) {
    //         beta = max;
    //         if (alpha >= beta) return beta;
    //     }

    //     this.successors().forEach(col => {
    //         this.move(col);
    //         let score = -this.negamax(col, -beta, -alpha, tt, count);
    //         this.undo(col);

    //         if (score >= beta) return score;
    //         if (score > alpha) alpha = score;

    //         count.c++;
    //     });

    //     tt.set(key, alpha + (WIDTH*HEIGHT - 1)/2);
    //     return alpha;
    // }
}

export { Connect4 }
