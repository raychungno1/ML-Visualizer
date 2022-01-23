/**
 * A self balancing binary tree that balances the special Arc class
 */
 class RBT {
    constructor(root = null) {
        this.root = root;
        if (this.root) this.root.isRed = false;
    }

    printTree() {
        prettyPrintTree(this.root);
    }

    printDLL() {
        if (!this.root) return; // exit if empty tree

        let node = this.root;
        while (node.left) node = node.left;

        let out = ""
        while (node) {
            out += node.value
            if (node.next) out += ", "
            node = node.next;
        }
        console.log(out);
    }

    isEmpty() {
        return !this.root;
    }

    setRoot(root) {
        this.root = root;
        this.root.isRed = false;
    }

    getLeftmostArc() {
        if (!this.root) return; // exit if empty tree

        let node = this.root;
        while (node.left) node = node.left;
        return node;
    }

    locateArcAbove(point, l) {
        let node = this.root;
        let found = false;

        while (!found) {
            let breakpointLeft = -Infinity;
            let breakpointRight = Infinity;

            if (node.prev) { // Compute the breakpoint between the current node & the previous
                breakpointLeft = RBT.computeBreakpoint(l, node.prev.focus, node.focus);
            }

            if (node.next) { // Compute the breakpoint between the current node & the next
                breakpointRight = RBT.computeBreakpoint(l, node.focus, node.next.focus);
            }

            // Binary search for node based on the breakpoints
            if (point.x < breakpointLeft) node = node.left;
            else if (point.x > breakpointRight) node = node.right;
            else found = true;
        }
        return node;
    }

    insert(value) {
        let parent = null;
        let root = this.root;
        while (root != null) {
            parent = root; /* update parent & root node */
            root = (root.value > value) ? root.left : root.right;
        }

        let node = new Node(value);
        node.parent = parent;

        if (!parent) {
            this.root = node;
        } else if (value < parent.value) {
            parent.left = node;
            node.prev = parent.prev;
            if (node.prev) node.prev.next = node;
            node.next = parent;
            parent.prev = node;
        } else {
            parent.right = node;
            node.next = parent.next;
            if (node.next) node.next.prev = node;
            node.prev = parent;
            parent.next = node;
        }

        this.insertFixup(node);
    }
    
    /** Inserts node y before x (in an in-order traversal) */
    insertBefore(x, y) {
        // Managing tree connections
        if (x.left) {
            x.prev.right = y;
            y.parent = x.prev;
        } else {
            x.left = y;
            y.parent = x;
        }

        // Manage DLL connections
        y.prev = x.prev;
        if (y.prev) y.prev.next = y;
        y.next = x;
        x.prev = y;

        // Balance the tree
        this.insertFixup(y);
    }

    /** Inserts node y before x (in an in-order traversal) */
    insertAfter(x, y) {
        // Managing tree connections
        if (x.right) {
            x.next.left = y;
            y.parent = x.next;
        } else {
            x.right = y;
            y.parent = x;
        }

        // Manage DLL connections
        y.next = x.next;
        if (y.next) y.next.prev = y;
        y.prev = x;
        x.next = y;

        // Balance the tree
        this.insertFixup(y);
    }

    insertFixup(x) {
        x = this.insertFixupA(x)
        x = this.insertFixupB(x)
        this.insertFixupC(x)
        this.root.isRed = false;
    }

    insertFixupA(x) {
        while (x.parent && x.parent.isRed) {
            let uncle = RBT.getSibling(x.parent);
            if (!uncle || !uncle.isRed) return x;

            x.parent.isRed = false;
            uncle.isRed = false;

            x = x.parent.parent;
            x.isRed = true;
        }
        return x;
    }

    insertFixupB(x) {
        if (!x || x === this.root || !x.parent.isRed) return;

        let parent = x.parent;
        let grandParent = parent.parent;
        if (x === parent.right && parent === grandParent.left) {
            x = parent;
            this.leftRotate(parent);
        } else if (x === parent.left && parent === grandParent.right) {
            x = parent;
            this.rightRotate(parent);
        }
        return x;
    }

    insertFixupC(x) {
        if (!x || x === this.root || !x.parent.isRed) return;
        let parent = x.parent;
        let grandParent = parent.parent;
        if (x === parent.left && parent === grandParent.left) {
            this.rightRotate(grandParent);
            parent.isRed = false;
            grandParent.isRed = true;
        } else if (x === parent.right && parent === grandParent.right) {
            this.leftRotate(grandParent);
            parent.isRed = false;
            grandParent.isRed = true;
        }
    }

    remove(x) {
        if (x === this.root && !(x.left || x.right)) {
            this.root = null;
            return;
        }

        // TESTING
        // let val = x;
        // x = this.root;
        // while (x && val != x.value) {
        //     x = (val < x.value) ? x.left : x.right;
        // }
        // if (!x) return;

        let xIsRed = x.isRed;
        let y, parent;

        // If node only has one child
        if (!x.left) {
            parent = x.parent;
            y = x.right;
            this.swap(x, x.right);
        } else if (!x.right) {
            parent = x.parent;
            y = x.left;
            this.swap(x, x.left);
        }

        // If both nodes are present
        else {
            let replacement = x.next;
            y = replacement.right;
            parent = replacement;
            xIsRed = replacement.isRed;

            if (replacement != x.right) {
                parent = replacement.parent;
                this.swap(replacement, replacement.right);

                replacement.right = x.right;
                replacement.right.parent = replacement;
            }

            this.swap(x, replacement);
            replacement.left = x.left;
            replacement.left.parent = replacement;
            replacement.isRed = x.isRed;
        }

        // Balance the tree
        if (!xIsRed) this.deleteFixup(y, parent);

        // Manage DDL Connections
        if (x.prev) x.prev.next = x.next;
        if (x.next) x.next.prev = x.prev;
    }

    deleteFixup(x, parent) {
        // While we havent reached the root & the node is black
        while (x != this.root && !(x && x.isRed)) {
            // sibling = RBT.getSibling(x);
            let sibling = (x === parent.left) ? parent.right : parent.left;

            // If sibling is red
            if (sibling.isRed) {
                sibling.isRed = false;
                parent.isRed = 1;

                if (x === parent.left) {
                    this.leftRotate(parent);
                    sibling = parent.right;
                } else {
                    this.rightRotate(parent);
                    sibling = parent.left;
                }
            }

            // If both of the sibling's children are black
            if ((!sibling.left || !sibling.left.isRed) && (!sibling.right || !sibling.right.isRed)) {
                sibling.isRed = true;
                x = parent;
                parent = parent.parent;
                continue;
            }

            // x is a left child
            if (x === parent.left) {
                // sibling's left child is red & right child is black
                if (!(sibling.right && sibling.right.isRed)) {
                    sibling.left.isRed = false;
                    sibling.isRed = true;
                    this.rightRotate(sibling);
                    sibling = parent.right;
                }
                // sibling's right child is red
                sibling.isRed = parent.isRed;
                parent.isRed = false;
                sibling.right.isRed = false;
                this.leftRotate(parent);
            }

            // x is a right child
            else {
                // sibling's right child is red & left child is black
                if (!(sibling.left && sibling.left.isRed)) {
                    sibling.right.isRed = false;
                    sibling.isRed = true;
                    this.leftRotate(sibling);
                    sibling = parent.left;
                }
                // sibling's left child is red
                sibling.isRed = parent.isRed;
                parent.isRed = false;
                sibling.left.isRed = false;
                this.rightRotate(parent);
            }
            x = this.root;
        }

        // set x to black
        if (x) x.isRed = false;
    }

    replace(x, y) {
        this.swap(x, y);
        y.left = x.left;
        y.right = x.right;

        if (y.left) y.left.parent = y;
        if (y.right) y.right.parent = y;

        y.prev = x.prev;
        y.next = x.next;

        if (y.prev) y.prev.next = y;
        if (y.next) y.next.prev = y;

        y.isRed = x.isRed;
    }

    leftRotate(x) {
        let y = x.right;
        let b = y.left;
        this.swap(x, y);

        x.right = b;
        if (b) b.parent = x;

        y.left = x;
        x.parent = y;
    }

    rightRotate(x) {
        let y = x.left;
        let b = y.right;
        this.swap(x, y);

        x.left = b;
        if (b) b.parent = x;

        y.right = x;
        x.parent = y;
    }

    swap(x, y) {
        let parent = x.parent;

        if (!parent) {
            this.root = y;
        } else if (x.parent.left === x) {
            parent.left = y;
        } else {
            parent.right = y;
        }

        if (y) y.parent = parent;
    }

    static getSibling(x) {
        return (x.parent.left === x) ? x.parent.right : x.parent.left;
    }

    // Computes the breakpoint between two arcs (each arc is a point & a sweepLine)
    static computeBreakpoint(y, p1, p2) {
		let dy = p1.y - p2.y;
		if (dy === 0) return (p1.x + p2.x) / 2;
		let dx = p1.x - p2.x;
		let p1Dist = p1.y - y; //Difference btw parabola 1 fy and directrix
		let p2Dist = p2.y - y; //Difference btw parabola 2 fy and directrix

		let numerator = (p2.x * p1Dist - p1.x * p2Dist) + Math.sqrt(p1Dist * p2Dist * (dx ** 2 + dy ** 2));
		return numerator / dy;
	}
}

/**
 * Dummy node class for testing the RBT
 */
class Node {
    constructor(val) {
        // Connections for the tree
        this.value = val;
        this.parent = null;
        this.left = null;
        this.right = null;
        this.isRed = true;

        // Allows DLL traversal through data structure
        this.next = null;
        this.prev = null;
    }
}

export { RBT }