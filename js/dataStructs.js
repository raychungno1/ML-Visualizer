class Queue {
    constructor(array=[]) {
        this.length = array.length
        this.queue = [...array]
    }

    insert(x) {
        this.length++
        this.queue.push(x)
    }

    remove() {
        this.length--
        return this.queue.shift()
    }
}

class Stack {
    constructor(array=[]) {
        this.length = array.length
        this.stack = [...array]
    }

    insert(x) {
        this.length++
        this.stack.unshift(x)
    }

    remove() {
        this.length--
        return this.stack.shift()
    }
}

class MinHeap {
    constructor(array=[]) {
        this.size = array.length
        this.heap = [...array]
        MinHeap.buildMinHeap(this.heap)
    }

    insert(x) {
        // Append element to end of array
        let i = this.size
        this.heap.push(x)

        // While the parent node is larger, swap it with the current one
        while (i > 0 && (this.heap[MinHeap.parent(i)][0] > this.heap[i][0])) {
            [this.heap[i], this.heap[MinHeap.parent(i)]] = [this.heap[MinHeap.parent(i)], this.heap[i]]
            i = MinHeap.parent(i)
        }

        // Increment size
        this.size++
    }

    remove() {
        // If heap size is 1
        if (this.size === 1) {
            this.size--
            return this.heap.pop()
        }

        let min = this.heap[0] // Save min element
        this.heap[0] = this.heap.pop() // Move last element of array to front
        this.size-- // Decrement size

        MinHeap.minHeapify(this.heap, 0) // Sift the copied value down
        return min // Output
    }

    // Access parent of node
    static parent(x) { return Math.floor((x - 1) / 2) }

    // Access left child of node
    static leftChild(x) { return (2 * x) + 1 }

    // Access right child of node
    static rightChild(x) { return (2 * x) + 2 }

    // Sifts an out-of-place root node down the heap
    static minHeapify(arr, index) {
        let done = false

        do {
            // Find min between the root, its left & its right child
            let smallest = index
            if (MinHeap.leftChild(index) < arr.length && (arr[MinHeap.leftChild(index)][0] < arr[smallest][0])) smallest = MinHeap.leftChild(index)
            if (MinHeap.rightChild(index) < arr.length && (arr[MinHeap.rightChild(index)][0] < arr[smallest][0])) smallest = MinHeap.rightChild(index)

            // Swap the root with that smallest value (from above)
            if (index !== smallest) {
                [arr[index], arr[smallest]] = [arr[smallest], arr[index]]
            } else {
                done = true // If no swaps nessecary, we're done
            }

            index = smallest // Repeat on the w/ child node
        } while (!done)
    }

    // Builds a min heap from an array
    static buildMinHeap(arr) {
        let index = Math.floor((arr.length / 2)) - 1
        while (index >= 0) MinHeap.minHeapify(arr, index--)
    }
}

export { Queue, Stack, MinHeap }
