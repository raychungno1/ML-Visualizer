class Event {
	constructor(type, position, caller, vertex) {
		this.type = type;
		this.caller = caller;
		this.position = position;
		this.vertex = vertex;
		this.active = true;
	}

	lessThan(event) {
		return this.position.y < event.position.y;
	}
}

export { Event }