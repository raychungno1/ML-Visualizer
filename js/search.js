import { Board } from "./board.js"
import { Queue, Stack, MinHeap } from "./dataStructs.js"

class Search {
    static BFS(board) {
        let visited = [] // Array to track visited nodes
        for (let i = 0; i < board.rows; i++) { visited.push(new Array(board.cols).fill(0)) }

        // While queue still has elements
        let queue = new Queue([[board.startState, "", 0]])
        while (queue.length > 0) {

            let [state, directions, cost] = queue.remove() // Remove a state from the queue

            visited[state[0]][state[1]] = 1 // Mark the state as visited

            if (board.isGoal(state)) { // If goal is found, return the directions
                return directions.split("")
            } 

            // Othwise, loop through each successor
            board.successors(state).forEach(successor => {

                // And add it to the queue if it hasn't been visited yet
                if (!visited[successor[0][0]][successor[0][1]]) {
                    queue.insert([successor[0], directions + successor[1], successor[2]])
                }
            })
        }
    }

    static DFS(board) {
        let visited = [] // Array to track visited nodes
        for (let i = 0; i < board.rows; i++) { visited.push(new Array(board.cols).fill(0)) }

        // While queue still has elements
        let stack = new Stack([[board.startState, "", 0]])
        while (stack.length > 0) {

            let [state, directions, cost] = stack.remove() // Remove a state from the queue

            visited[state[0]][state[1]] = 1 // Mark the state as visited

            if (board.isGoal(state)) { // If goal is found, return the directions
                return directions.split("")
            } 

            // Othwise, loop through each successor
            board.successors(state).forEach(successor => {

                // And add it to the queue if it hasn't been visited yet
                if (!visited[successor[0][0]][successor[0][1]]) {
                    stack.insert([successor[0], directions + successor[1], successor[2]])
                }
            })
        }
    }

    static UCS(board) {
        let visited = [] // Array to track visited nodes
        for (let i = 0; i < board.rows; i++) { visited.push(new Array(board.cols).fill(0)) }

        // While queue still has elements
        let heap = new MinHeap([[0, [board.startState, "", 0]]])
        while (heap.size > 0) {

            let [state, directions, cost] = heap.remove()[1] // Remove a state from the queue

            visited[state[0]][state[1]] = 1 // Mark the state as visited

            if (board.isGoal(state)) { // If goal is found, return the directions
                return directions.split("")
            } 

            // Othwise, loop through each successor
            board.successors(state).forEach(successor => {

                // And add it to the queue if it hasn't been visited yet
                if (!visited[successor[0][0]][successor[0][1]]) {
                    heap.insert([successor[2], [successor[0], directions + successor[1], successor[2]]])
                }
            })
        }
    }
}
