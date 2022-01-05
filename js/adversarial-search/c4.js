const SIZE = 42;

class C4 {
    /* Creates a bitboard reperesentation of connect 4 (yellow goes first) */
    constructor() {
        this.bitboard = new BigUint64Array([0n, 0n]);
        this.height = [0, 7, 14, 21, 28, 35, 42];
        this.counter = 0;
        this.moves = [];
        this.tTable = new Map();
    }

    /* Performs a move (must be legal) */
    move(col) {
        let move = 1n << BigInt(this.height[col]++); // Identify bit to modify & update height
        this.bitboard[this.counter++ & 1] ^= move; // Update bit in proper table & update counter
        this.moves.push(col); // Stores move
    }

    /* Undos the previous move */
    undo() {
        let col = this.moves.pop(); // Get last move
        let move = 1n << BigInt(--this.height[col]); // Identify bit to undo & update height
        this.bitboard[--this.counter & 1] ^= move; // Update bit in proper table & update counter
    }

    /* Returns true if it is the yellow player's turn */
    yellowTurn() {
        return !(this.counter & 1)
    }

    /* Returns true if a winning combination is found */
    isWin() {
        let directions = [1, 7, 6, 8];
        let bb;
        for (let direction of directions) {
            bb = this.bitboard[this.counter - 1 & 1] & (this.bitboard[this.counter - 1 & 1] >> BigInt(direction));
            if (bb & (bb >> BigInt(2 * direction))) return true;
        }
        return false;
    }

    /* Gets the combo of a winning position in [row, col] format */
    getCombo() {
        let type = ["col", "row", "diag1", "diag2"];
        let directions = [1, 7, 6, 8].entries();
        let bb;
        for (let [i, direction] of directions) {
            bb = this.bitboard[this.counter - 1 & 1] & (this.bitboard[this.counter - 1 & 1] >> BigInt(direction));
            if (bb = bb & (bb >> BigInt(2 * direction))) {
                let idx = 0;
                let j = 1n;
                while (!(j & bb)) {
                    j = j << 1n;
                    idx++;
                }
                return { type: type[i],
                        combo: [this.toCoords(idx),
                                this.toCoords(idx + direction),
                                this.toCoords(idx + 2 * direction),
                                this.toCoords(idx + 3 * direction)]};
            }
        }
    }

    // Converts an index to a [row, col] format
    toCoords(idx) {
        return [5 - idx % 7, Math.floor(idx / 7)];
    }

    /* Returns true if there is a draw */
    isDraw() {
        return this.counter === 42;
    }

    /* Returns valid successors */
    successors() {
        let moves = []
        let order = [3, 2, 4, 1, 5, 0, 6]
        let TOP = 0b1000000_1000000_1000000_1000000_1000000_1000000_1000000n;
        // return [3, 2, 4, 1, 5, 0, 6].filter(col => !(TOP & 1n << BigInt(this.height[col])));
        for (let col = 0; col < 7; col++) {
            if (!(TOP & 1n << BigInt(this.height[col]))) moves.push(col);
        }
        return moves;
    }

    /* Returns true if a column is not full */ 
    isValid(col) {
        return this.height[col] !== (7 * col + 6);
    }

    /* Prints a ASCII representation (X = yellow, O = red) */
    print() {
        let out = ["", "", "", "", "", "", ""];

        for (let i = 0, row; row = 6 - i % 7, i < 49; i++) {
            if      ((this.bitboard[0] >> BigInt(i)) & 1n) out[row] += "X";
            else if ((this.bitboard[1] >> BigInt(i)) & 1n) out[row] += "O";
            else                                           out[row] += "-"
    
            out[6 - i % 7] += (i < 42) ? " " : "";
        }
    
        console.log(out.join("\n"));
    }

    bestMove() {
        let bestScore = -SIZE;
        let successors = this.successors();
        console.log(successors)
        let bestCol = successors[0];
        let stat = {
            depth: 1,
            positions: 0,
            wins: 0
        };
        // let tTable = new Map();

        for (let col of successors) {
            this.move(col);
            stat.positions++;
            if (this.isWin()) {
                this.undo();
                bestCol = col;
                break;
            }

            let max = SIZE - this.counter;
            let min = -max;

            while(min < max) {                    // iteratively narrow the min-max exploration window
                let med = min + (max - min)/2;
                if(med <= 0 && min/2 < med) {
                    med = min/2;
                } else if (med >= 0 && max/2 > med) {
                    med = max/2;
                }
                let r = this.negamax(med, med + 1, 1, stat);   // use a null depth window to know if the actual score is greater or smaller than med
                if(r <= med) {
                    max = r;
                } else {
                    min = r;
                }
            }
            if (-min > bestScore) {
                bestScore = -min;
                bestCol = col;
            }
            console.log(`Col: ${col} Score: ${-min}`)
            if (-min > 0) stat.wins++;
            this.undo();
        }

        console.log(stat);
        console.log(`Best Col: ${bestCol}`)
        return bestCol;
    }

    negamax(alpha, beta, depth, stat) {
        stat.depth = Math.max(stat.depth, depth);
        if (this.isWin()) return this.counter - SIZE;
        if (this.isDraw()) return 0;

        let key = this.bitboard.toString();
        let max = Math.min(this.tTable.get(key), (SIZE - 1 - this.counter));
        if (beta > max) {
            beta = max;
            if (alpha >= beta) return beta;
        }

        let bestScore = this.counter - SIZE;
        let successors = this.possibleNonLosingMoves();
        for (let col of successors) {
            this.move(col);
            stat.positions++;

            let score = -this.negamax(-beta, -alpha, depth + 1, stat);
            this.undo();
            
            if (score > bestScore) bestScore = score;
            if (bestScore > alpha) alpha = bestScore;
            if (alpha >= beta) return alpha;
        }

        this.tTable.set(key, bestScore);
        return bestScore;
    }

    possibleNonLosingMoves() {
        let possible = this.successors();
        let winningMoves = []
        let nonLosing = possible.filter(col => {
            this.move(col);

            if (this.isWin()) {
                winningMoves.push(col);
                this.undo();
                return false;
            }

            let nonLosing = this.successors().every(move => {
                this.move(move);
                let result = this.isWin();
                this.undo();
                return !result;
            });

            this.undo();
            return nonLosing;
        });

        if (winningMoves.length !== 0) return winningMoves;
        return nonLosing.sort((a, b) => { return this.moveScore(b) - this.moveScore(a) });
    }

    moveScore(move) {
        this.move(move);
        let score = 0;

        this.successors().forEach(col => {
            let testMove = 1n << BigInt(this.height[col]);
            this.bitboard[this.counter - 1 & 1] ^= testMove;
            if (this.isWin()) score++;
            this.bitboard[this.counter - 1 & 1] ^= testMove;
        });

        this.undo();
        return score;
    }
}

export { C4 }

// let b = new C4();
// let m = [4, 3, 3, 2, 1, 2, 1, 1, 0, 3];
// m.forEach(col => {
//     b.move(col);
// })
// b.print();
// console.log(b.possibleNonLosingMoves());
// b.successors().forEach(col => {
//     console.log(b.moveScore(col))
// });
// console.log(b.possibleNonLosingMoves())
// console.log(b.possible().toString(2))
// console.log(b.isWin());
// console.log(b.getCombo());
// console.log(b.successors());
// console.log(b.isValid(1));
