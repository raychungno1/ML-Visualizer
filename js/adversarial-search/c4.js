class C4 {
    /* Creates a bitboard reperesentation of connect 4 (yellow goes first) */
    constructor() {
        this.bitboard = new BigUint64Array([0n, 0n]);
        this.height = [0, 7, 14, 21, 28, 35, 42];
        this.counter = 0;
        this.moves = [];
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
        // 1 = vertical direction
        // 7 = horizontal direction
        // 6 = diagonal \
        // 8 = diagonal /
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
        return this.moves === 42;
    }

    /* Returns valid successors */
    successors() {
        let moves = []
        let TOP = 0b1000000_1000000_1000000_1000000_1000000_1000000_1000000n;
        for (let col = 0; col < 7; col++) {
            if (!(TOP & 1n << BigInt(this.height[col]))) moves.push(col);
        }
        return moves;
    }

    /* Returns true if a column is not full */ 
    isValid(col) {
        return this.height[col] !== (7 * col + 6);
    }

    bestMove() {
        return Math.floor(Math.random() * 7);
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
}

export { C4 }

let b = new C4();
b.move(4);
b.move(3);
b.move(3);
b.move(2);
b.move(1);
b.move(2);
b.move(2);
b.move(1);
b.move(0);
b.move(1);
b.move(1);
// b.move(1);
// b.move(1);
// b.print();
// console.log(b.isWin());
// console.log(b.getCombo());
// console.log(b.successors());
// console.log(b.isValid(1));
