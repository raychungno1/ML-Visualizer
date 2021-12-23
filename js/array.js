/**
 * Shuffles an array using the Durstenfeld Shuffle
 * @param {Array} array 
 * @returns a shuffled array
 */
function arrShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

/**
 * Checks the equality of 2 arrays
 * @returns true if the array elements are equal
 */
function arrEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

export { arrShuffle, arrEquals }