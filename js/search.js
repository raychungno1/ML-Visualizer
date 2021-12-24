import { Board } from "./board.js"
import { Queue, Stack, KV, MinHeap } from "./dataStructs.js"

class Search {
    static BFS(board) {
        let visited = [] // Array to track visited nodes
        let expansion = []
        for (let i = 0; i < board.rows; i++) { visited.push(new Array(board.cols).fill(0)) }

        let [startRow, startCol] = board.startState
        visited[startRow][startCol] = 1
        expansion.push(board.startState)

        // While queue still has elements
        let queue = new Queue([[board.startState, [], []]])
        while (queue.size > 0) {

            let [state, directions, totalCost] = queue.remove() // Remove a state from the queue
            expansion.push(state)

            if (board.isGoal(state)) { // If goal is found, return the directions
                return [directions, totalCost, expansion]
            } 

            // Othwise, loop through each successor
            board.successors(state).forEach(([sState, sDir, sCost]) => {

                let [row, col] = sState
                // And add it to the queue if it hasn't been visited yet
                if (!visited[row][col]) {
                    visited[row][col] = 1 // Mark the state as visited
                    queue.insert([sState, [...directions, sDir], [...totalCost, sCost]])
                }
            })
        }
    }

    static DFS(board) {
        let visited = [] // Array to track visited nodes
        let expansion = []
        for (let i = 0; i < board.rows; i++) { visited.push(new Array(board.cols).fill(0)) }

        let [startRow, startCol] = board.startState
        visited[startRow][startCol] = 1
        expansion.push(board.startState)

        // While stack still has elements
        let stack = new Stack([[board.startState, [], []]])
        while (stack.size > 0) {

            let [state, directions, totalCost] = stack.remove() // Remove a state from the stack
            expansion.push(state)

            if (board.isGoal(state)) { // If goal is found, return the directions
                return [directions, totalCost, expansion]
            } 

            // Othwise, loop through each successor
            board.successors(state).forEach(([sState, sDir, sCost]) => {

                let [row, col] = sState
                // And add it to the stack if it hasn't been visited yet
                if (!visited[row][col]) {
                    visited[row][col] = 1 // Mark the state as visited
                    stack.insert([sState, [...directions, sDir], [...totalCost, sCost]])
                }
            })
        }
    }

    static UCS(board) {
        let visited = [] // Array to track visited nodes
        let expansion = []
        for (let i = 0; i < board.rows; i++) { visited.push(new Array(board.cols).fill(0)) }

        let [startRow, startCol] = board.startState
        visited[startRow][startCol] = 1
        expansion.push(board.startState)

        // While heap still has elements
        let heap = new MinHeap([new KV(0, 0, [board.startState, [], []])])
        while (heap.size > 0) {

            let node = heap.remove()
            let [state, directions, totalCost] = node.value // Remove a state from the heap
            expansion.push(state)
            
            if (board.isGoal(state)) { // If goal is found, return the directions
                return [directions, totalCost, expansion]
            }

            // Othwise, loop through each successor
            board.successors(state).forEach(([sState, sDir, sCost]) => {

                let [row, col] = sState
                // And add it to the heap if it hasn't been visited yet
                if (!visited[row][col]) {
                    visited[row][col] = 1 // Mark the state as visited
                    heap.insert(new KV(sCost, node.depth + 1, [sState, [...directions, sDir], [...totalCost, sCost]]))
                }
            })
        }
    }
}

export { Search }

