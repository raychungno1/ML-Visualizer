
class Position {

    static WIDTH = 7n;
    static HEIGHT = 6n;
    static MIN_SCORE = -(Position.WIDTH * Position.HEIGHT) / 2n + 3n // -18
    static MAX_SCORE = (Position.WIDTH * Position.HEIGHT) / 2n - 3n // 18
    static BOTTOM_MASK = 0b0000001_0000001_0000001_0000001_0000001_0000001_0000001n;
    static BOARD_MASK = 0b0111111_0111111_0111111_0111111_0111111_0111111_0111111n;
    static COL_ORDER = [3, 2, 4, 1, 5, 0, 6];

    constructor(pos, mask, moves) {
        this.position = pos || 0n;
        this.mask = mask || 0n;
        this.moves = moves || 0;
    }

    /** Checks if a column is playable */
    canPlay(col) {
        return (this.mask & topMask(col)) === 0n;
    }

    /** 
     * Plays a possible move given its bitmap representation
     * There should only be one bit set to 1 & the move should be valid
     */
    play(move) {
        this.position ^= this.mask;
        this.mask |= move;
        this.moves++;
    }

    /** Plays a valid column */
    playCol(col) {
        this.play((this.mask + bottomMask(col)) & colMask(col));
    }

    playCols(cols) {
        cols = cols.split("").map(char => +char);
        for (let i = 0; i < cols.length; i++) {
            let col = cols[i] - 1;
            if (col < 0 || col >= Position.WIDTH || !this.canPlay(col) || this.isWinningMove(col)) return i;
            this.playCol(col);
        }
        return this.moves;
    }

    isWinningMove(col) {
        return this.winningPosition() & this.possible() & colMask(col);
    }

    isDraw() {
        return this.moves === Position.WIDTH * Position.HEIGHT;
    }

    /** Returns true if player can win next move */
    canWinNext() {
        return this.winningPosition() & this.possible();
    }

    /* Returns a key for the position */
    key() {
        return this.position + this.mask;
    }

    /* Returns a bitmap of all possible non-losing moves */
    possibleNonLosingMoves() {
        let possible_mask = possible();
        let opponent_win = opponent_winning_position();
        let forced_moves = possible_mask & opponent_win;
        if(forced_moves) {
          if(forced_moves & (forced_moves - 1)) // check if there is more than one forced move
            return 0;                           // the opponnent has two winning moves and you cannot stop him
          else possible_mask = forced_moves;    // enforce to play the single forced move
        }
        return possible_mask & ~(opponent_win >> 1);  // avoid to play below an opponent winning spot
    }

    /** Scores a possible move */
    moveScore(move) {
        return popCount(computeWinningPosition(this.position | move, this.mask));
    }

    /** Return a bitmask of possible winning positions for current player */
    winningPosition() {
        return computeWinningPosition(this.position, this.mask);
    }

    /* Return a bitmask of possible winning positions for opponent */
    opponentWinningPosition() {
        return computeWinningPosition(this.position ^ this.mask, this.mask);
    }

    /** Return bitmap of all valid moves for current player */
    possible() {
        return (this.mask + Position.BOTTOM_MASK) & Position.BOARD_MASK;
    }

}

/* returns a bit map of all winning moves */
function computeWinningPosition(position, mask) {
    // vertical;
    let r = (position << 1n) & (position << 2n) & (position << 3n);

    //horizontal
    let p = (position << (Position.HEIGHT + 1n)) & (position << 2n * (Position.HEIGHT + 1n));
    r |= p & (position << 3n * (Position.HEIGHT + 1n));
    r |= p & (position >> (Position.HEIGHT + 1n));
    p = (position >> (Position.HEIGHT + 1n)) & (position >> 2n * (Position.HEIGHT + 1n));
    r |= p & (position << (Position.HEIGHT + 1n));
    r |= p & (position >> 3n * (Position.HEIGHT + 1n));

    //diagonal 1
    p = (position << Position.HEIGHT) & (position << 2n * Position.HEIGHT);
    r |= p & (position << 3n * Position.HEIGHT);
    r |= p & (position >> Position.HEIGHT);
    p = (position >> Position.HEIGHT) & (position >> 2n * Position.HEIGHT);
    r |= p & (position << Position.HEIGHT);
    r |= p & (position >> 3n * Position.HEIGHT);

    //diagonal 2
    p = (position << (Position.HEIGHT + 2n)) & (position << 2n * (Position.HEIGHT + 2n));
    r |= p & (position << 3n * (Position.HEIGHT + 2n));
    r |= p & (position >> (Position.HEIGHT + 2n));
    p = (position >> (Position.HEIGHT + 2n)) & (position >> 2n * (Position.HEIGHT + 2n));
    r |= p & (position << (Position.HEIGHT + 2n));
    r |= p & (position >> 3n * (Position.HEIGHT + 2n));

    return r & (Position.BOARD_MASK ^ mask);
}

/** Counts number of 1's in a string of bits */
function popCount(pos) {
    let c = 0;
    for (c = 0; m; c++) m &= m - 1;
    return c;
}

// return a bitmask w/ a single 1 at the top of a column
function topMask(col) {
    return (1n << (Position.HEIGHT - 1n)) << BigInt(col) * (Position.HEIGHT + 1n);
}

// return a bitmask w/ a single 1 at the bottom of a column
function bottomMask(col) {
    return 1n << BigInt(col) * (Position.HEIGHT + 1n);
}

// Return a bitmask w/ 1's on all the cell of a column
function colMask(col) {
    return ((1n << Position.HEIGHT) - 1n) << BigInt(col) * (Position.HEIGHT + 1n);
}

export { Position }

// let b = new Position();
// b.playCols("112233");
// console.log(b.isWinningMove(0));