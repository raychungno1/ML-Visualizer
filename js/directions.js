class Directions {

    /**
     * For each direction (n, s, e, w), initialize:
     *      1. its index in the array [n, s, e, w]
     *      2. its opposite index in the array [n, s, e, w]
     *      3. function that returns a state [row, col] in that direction
     */
    static n = {
        index: 0,
        oppositeIndex: 1,
        update: function north(state) { return [state[0] - 1, state[1]] }
    }

    static s = {
        index: 1,
        oppositeIndex: 0,
        update: function south(state) { return [state[0] + 1, state[1]] }
    }

    static e = {
        index: 2,
        oppositeIndex: 3,
        update: function east(state) { return [state[0], state[1] + 1] }
    }

    static w = {
        index: 3,
        oppositeIndex: 2,
        update: function west(state) { return [state[0], state[1] - 1] }
    }
}

export { Directions }
