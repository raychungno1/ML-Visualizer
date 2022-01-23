class Arc {
	constructor(f, el, er) {
		// Tree
		this.parent = null;
		this.left = null;
		this.right = null;
		this.isRed = true;

		// Doubly linked list
		this.prev = null;
        this.next = null;

		this.focus = f; // Point
		this.edge = { left: el, right: er }; // Edge
		this.event = null;
	}

	get value() {
		return ([this.focus.x.toFixed(2), this.focus.y.toFixed(2)]);
	}
}

export { Arc }