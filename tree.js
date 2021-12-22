module.exports = class Tree {
    /** Initializes a new tree */
    constructor() { this.parent = null }

    /** Returns root of tree */
    root() { return (this.parent === null) ? this : this.parent.root() }

    /** Checks if two trees are connected */
    isConnected(tree) { return this.root() === tree.root() }

    /** Connects two trees */
    connect(tree) { tree.root().parent = this }
}
