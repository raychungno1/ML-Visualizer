function maxValue(state) {
    if (state.isTerminal()) return state.getWinner();

    let max = -Infinity;
    let successors = state.successors();
    
    successors.forEach(successor => {
        state.move(successor);
        max = Math.max(max, minValue(state));
        state.undo();
    });

    return max;
}

function minValue(state) {
    if (state.isTerminal()) return state.getWinner();

    let min = Infinity;
    let successors = state.successors();
    
    successors.forEach(successor => {
        state.move(successor);
        min = Math.min(min, maxValue(state));
        state.undo();
    });
    return min;
}

export { maxValue, minValue }