import { Queue, Stack, KV, MinHeap } from "../data-structs.js"
import { arrEquals } from "./array.js"

class Search {
    
    static BFS(board) {
        let expansion = [] // Array to track expanded nodes
        let queue = new Queue([[board.startState, [], []]]) // Queue of nodes to expand
        
        while (queue.size > 0) { // While queue still has elements
            let [state, directions, totalCost] = queue.remove() // Remove a node from the queue
            
            // If the if the node hasnt been visited
            if (!expansion.find(element => arrEquals(element, state))) {
                expansion.push(state) // Mark it as visited

                // If goal is found, return the directions
                if (board.isGoal(state)) return [directions, totalCost, expansion]

                // Othwise, add each successor to the queue
                board.successors(state).forEach(([sState, sDir, sCost]) => {
                    queue.insert([sState, [...directions, sDir], [...totalCost, sCost]])
                })
            }
        }
    }

    static DFS(board) {
        let expansion = [] // Array to track expanded nodes
        let stack = new Stack([[board.startState, [], []]]) // stack of nodes to expand

        while (stack.size > 0) { // While stack still has elements
            let [state, directions, totalCost] = stack.remove() // Remove a node from the stack
            
            // If the if the node hasnt been visited
            if (!expansion.find(element => arrEquals(element, state))) {
                expansion.push(state) // Mark it as visited

                // If goal is found, return the directions
                if (board.isGoal(state)) return [directions, totalCost, expansion]

                // Othwise, add each successor to the stack
                board.successors(state).forEach(([sState, sDir, sCost]) => {
                    stack.insert([sState, [...directions, sDir], [...totalCost, sCost]])
                })
            }
        }
    }

    static UCS(board) {
        let expansion = [] // Array to track expanded nodes
        let heap = new MinHeap([new KV(0, 0, [board.startState, [], []])]) // heap of nodes to expand
        
        while (heap.size > 0) { // While heap still has elements
            let {cost, depth, value: [state, directions, totalCost]} = heap.remove() // Remove a state from the heap

            // If the if the node hasnt been visited
            if (!expansion.find(element => arrEquals(element, state))) {
                expansion.push(state) // Mark it as visited

                // If goal is found, return the directions
                if (board.isGoal(state)) return [directions, totalCost, expansion]

                // Othwise, add each successor to the stack
                board.successors(state).forEach(([sState, sDir, sCost]) => {
                    heap.insert(new KV(cost + sCost, depth + 1, [sState, [...directions, sDir], [...totalCost, sCost]]))
                })
            }
        }
    }

    static greedy(board) {
        let expansion = [] // Array to track expanded nodes
        let goal = board.goalState // Goal state
        let heap = new MinHeap([new KV(
            Search.heuristic(board.startState, goal),
            0,
            [board.startState, [], []]
        )]) // heap of nodes to expand
        
        while (heap.size > 0) { // While heap still has elements
            let {depth, value: [state, directions, totalCost]} = heap.remove() // Remove a state from the heap

            // If the if the node hasnt been visited
            if (!expansion.find(element => arrEquals(element, state))) {
                expansion.push(state) // Mark it as visited

                // If goal is found, return the directions
                if (board.isGoal(state)) return [directions, totalCost, expansion]

                // Othwise, add each successor to the stack
                board.successors(state).forEach(([sState, sDir, sCost]) => {
                    heap.insert(new KV(
                        Search.heuristic(sState, goal),
                        depth + 1,
                        [sState, [...directions, sDir], [...totalCost, sCost]]
                    ))
                })
            }
        }
    }

    static aStar(board) {
        let expansion = [] // Array to track expanded nodes
        let goal = board.goalState // Goal state
        let heap = new MinHeap([new KV(
            Search.heuristic(board.startState, goal),
            0,
            [board.startState, [], []]
        )]) // heap of nodes to expand
        
        while (heap.size > 0) { // While heap still has elements
            let {cost, depth, value: [state, directions, totalCost]} = heap.remove() // Remove a state from the heap

            // If the if the node hasnt been visited
            if (!expansion.find(element => arrEquals(element, state))) {
                expansion.push(state) // Mark it as visited

                // If goal is found, return the directions
                if (board.isGoal(state)) return [directions, totalCost, expansion]

                // Othwise, add each successor to the stack
                board.successors(state).forEach(([sState, sDir, sCost]) => {
                    heap.insert(new KV(
                        cost + sCost + Search.heuristic(sState, goal),
                        depth + 1,
                        [sState, [...directions, sDir], [...totalCost, sCost]]
                    ))
                })
            }
        }
    }
    
    /** Uses manhattan distance as a heuristic */
    static heuristic(state, goalState) {
        // return Math.abs(state[0] - goalState[0]) + Math.abs(state[1] - goalState[1])
        return Math.sqrt(
            ((state[0] - goalState[0]) ** 2) +
            ((state[1] - goalState[1]) ** 2)
        )
    }
}

export { Search }
