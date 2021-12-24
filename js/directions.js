class Directions {

    /**
     * For each direction (n, s, e, w), initialize:
     *      1. its index in the array [n, s, e, w]
     *      2. its opposite index in the array [n, s, e, w]
     *      3. function that returns a state [row, col] in that direction
     */
    static n = {
        dir: "n",
        opposite: "s",
        update: function north(state) { return [state[0] - 1, state[1]] }
    }

    static s = {
        dir: "s",
        opposite: "n",
        update: function south(state) { return [state[0] + 1, state[1]] }
    }

    static e = {
        dir: "e",
        opposite: "w",
        update: function east(state) { return [state[0], state[1] + 1] }
    }

    static w = {
        dir: "w",
        opposite: "e",
        update: function west(state) { return [state[0], state[1] - 1] }
    }
}

export { Directions }
