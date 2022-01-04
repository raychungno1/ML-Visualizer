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
        let successors = this.successors()
        let bestCol = successors[0];
        let count = {c: 1};
        
        let alpha = -SIZE;
        let beta = SIZE;
        successors.forEach(col => {
            this.move(col);
            count.c++;
            
            let score = -this.negamax(col, alpha, beta, count);
            if (score > bestScore) {
                bestScore = score;
                bestCol = col;
            }
            this.undo(col);
            
            console.log(`Col: ${col} Score: ${score}`)
        });

        console.log(count);
        console.log(`Best Col: ${bestCol}`)
        return bestCol;
    }

    negamax(lastCol, alpha, beta, count) {
        if (this.checkWin(lastCol)) return this.moves - SIZE;
        if (this.isDraw()) return 0;

        let max = SIZE - 1 - this.moves;
        if (beta > max) {
            beta = max;
            if (alpha >= beta) return beta;
        }

        let bestScore = -SIZE;
        this.successors().forEach(col => {
            this.move(col);
            count.c++;

            let score = -this.negamax(col, -beta, -alpha, count);
            this.undo(col);
            
            if (score > bestScore) bestScore = score;
            if (bestScore > alpha) alpha = bestScore;
            if (alpha >= beta) return alpha;
        });
        return bestScore;
    }

    // negamax3(lastCol, alpha, beta, count) {
    //     if (this.checkWin(lastCol)) return this.moves - SIZE;
    //     if (this.isDraw()) return 0;

    //     let max = SIZE - 1 - this.moves;
    //     if (beta > max) {
    //         beta = max;
    //         if (alpha >= beta) return beta;
    //     }

    //     let bestScore = -SIZE;
    //     this.successors().forEach(col => {
    //         this.move(col);
    //         count.c++;

    //         let score = -this.negamax(col, -beta, -alpha, count);
    //         this.undo(col);
            
    //         if (score > bestScore) bestScore = score;
    //         if (score > alpha) alpha = score;
    //         if (alpha >= beta) return alpha;
    //     });
    //     return bestScore;
    // }

    // negamax2(lastCol, count) {
    //     if (this.checkWin(lastCol)) return this.moves - SIZE;
    //     if (this.isDraw()) return 0;

    //     let bestScore = -SIZE;
    //     this.successors().forEach(col => {
    //         this.move(col);
    //         count.c++;
            
    //         bestScore = Math.max(bestScore, -this.negamax2(col, count));
    //         this.undo(col);
    //     });
    //     return bestScore;
    // }
}

export { Connect4 }
