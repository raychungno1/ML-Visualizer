class Queue {
    constructor(array=[]) {
        this.size = array.length
        this.queue = [...array]
    }

    insert(x) {
        this.size++
        this.queue.push(x)
    }

    remove() {
        this.size--
        return this.queue.shift()
    }
}

class Stack {
    constructor(array=[]) {
        this.size = array.length
        this.stack = [...array]
    }

    insert(x) {
        this.size++
        this.stack.unshift(x)
    }

    remove() {
        this.size--
        return this.stack.shift()
    }
}

class KV {
    constructor(cost, depth, value) {
        this.cost = cost
        this.depth = depth
        this.value = value
    }

    lessThan(x) {
        // First compare by cost        // Then commpare by depth
        return (this.cost < x.cost) || (this.cost === x.cost && this.depth < x.depth)
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

        // While the current node is smaller, swap it with its parent
        while (i > 0 && this.heap[i].lessThan(this.heap[MinHeap.parent(i)])) {
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
            let smallest = index
            let left = MinHeap.leftChild(index)
            let right = MinHeap.rightChild(index)
            
            // Find min between the root, its left & its right child
            if (left < arr.length && arr[left].lessThan(arr[smallest])) smallest = left
            if (right < arr.length && arr[right].lessThan(arr[smallest])) smallest = right

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

export { Queue, Stack, KV, MinHeap }
