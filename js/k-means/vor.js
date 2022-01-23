import { Point } from "./point.js";
import { Arc } from "./arc.js"
import { Edge } from "./edge.js"
import { Event } from "./event.js"
import { MinHeap } from "../data-structs.js"
import { RBT } from "./rbt.js"

class VoronoiDiagram {

	constructor(points, width, height) {
		this.point_list = points;
		this.reset();
		this.box_x = width;
		this.box_y = height;
	}

	reset() {
		this.event_list = null;
		this.beachline = new RBT();
		this.voronoi_vertex = [];
		this.edges = [];
	}

	update() {
		this.reset();
		let points = [];
		let e = null;
		for (const p of this.point_list) points.push(new Event("point", p));
		this.event_list = new MinHeap(points);

		while (this.event_list.size) {
			e = this.event_list.remove();
			if (e.type == "point") this.point_event(e.position);
			else if (e.active) this.circle_event(e);
		}
		this.complete_segments(e.position);
	}

	point_event(p) {
		if (this.beachline.isEmpty()) {
			this.beachline.setRoot(new Arc(p, null, null));
			return;
		}

		let q = this.beachline.locateArcAbove(p, p.y)
		
		// if(q === this.beachline_root && q.focus.y == p.y) xx = (q.focus.x + p.x)/2 // edge case when the two top sites have same y
		let e_qp = new Edge(q.focus, p, p.x);
		let e_pq = new Edge(p, q.focus, p.x);

		let arc_p = new Arc(p, e_qp, e_pq);
		let arc_qr = new Arc(q.focus, e_pq, q.edge.right);
		this.beachline.insertAfter(q, arc_p);
		this.beachline.insertAfter(arc_p, arc_qr);
		q.edge.right = e_qp;

		// Disable old event
		if (q.event) q.event.active = false;

		// Check edges intersection
		this.add_circle_event(p, q);
		this.add_circle_event(p, arc_qr);

		this.edges.push(e_qp);
		this.edges.push(e_pq);
	}

	circle_event(e) {
		let arc = e.caller;
		let p = e.position;
		let edge_new = new Edge(arc.prev.focus, arc.next.focus);

		// Disable events
		if (arc.prev.event) arc.prev.event.active = false;
		if (arc.next.event) arc.next.event.active = false;

		// Adjust beachline deleting the shrinking arc
		arc.prev.edge.right = edge_new;
		arc.next.edge.left = edge_new;
		this.beachline.remove(arc);

		this.edges.push(edge_new);

		if (!this.point_outside(e.vertex)) this.voronoi_vertex.push(e.vertex); // Only add the vertex if inside canvas
		arc.edge.left.end = arc.edge.right.end = edge_new.start = e.vertex; // This needs to come before add_circle_event as it is used there

		this.add_circle_event(p, arc.prev);
		this.add_circle_event(p, arc.next);
	}

	add_circle_event(p, arc) {
		if (arc.prev && arc.next) {
			let a = arc.prev.focus;
			let b = arc.focus;
			let c = arc.next.focus;

			//Compute sine of angle between focuses. if positive then edges intersect
			if ((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y) > 0) {
				let new_inters = this.edge_intersection(
					arc.edge.left,
					arc.edge.right
				);
				let circle_radius = Math.sqrt(
					(new_inters.x - arc.focus.x) ** 2 +
						(new_inters.y - arc.focus.y) ** 2
				);
				let event_pos = circle_radius + new_inters.y;
				if (event_pos > p.y && new_inters.y < this.box_y) {
					// This is important new_inters.y < this.box_y
					let e = new Event(
						"circle",
						new Point(new_inters.x, event_pos),
						arc,
						new_inters
					);
					arc.event = e;
					this.event_list.insert(e);
				}
			}
		}
	}

	edge_intersection(e1, e2) {
		if (e1.m == Infinity) return new Point(e1.start.x, e2.getY(e1.start.x));
		else if (e2.m == Infinity)
			return new Point(e2.start.x, e1.getY(e2.start.x));
		else {
			let mdif = e1.m - e2.m;
			if (mdif == 0) return null;
			let x = (e2.q - e1.q) / mdif;
			let y = e1.getY(x);
			return new Point(x, y);
		}
	}

	complete_segments(last) {
		let r = this.beachline.getLeftmostArc();
		let e, x, y;
		// Complete edges attached to beachline
		while (r.next) {
			e = r.edge.right;
			x = RBT.computeBreakpoint(
				last.y * 1.1,
				e.arc.left,
				e.arc.right
			); // Check parabola intersection assuming sweepline position equal to last event increased by 10%
			y = e.getY(x);

			// Find end point
			if (
				(e.start.y < 0 && y < e.start.y) ||
				(e.start.x < 0 && x < e.start.x) ||
				(e.start.x > this.box_x && x > e.start.x)
			) {
				e.end = e.start; //If invalid make start = end so it will be deleted later
			} else {
				// If slope has same sign of the difference between start point x coord
				// and parabola intersection then will intersect the top border (y = 0)
				if (e.m == 0) {
					x - e.start.x <= 0 ? (x = 0) : (x = this.box_x);
					e.end = new Point(x, e.start.y);
					this.voronoi_vertex.push(e.end);
				} else {
					// If edge is vertical and is connected to the beachline will end on the bottom border
					if (e.m == Infinity) y = this.box_y;
					else
						e.m * (x - e.start.x) <= 0 ? (y = 0) : (y = this.box_y);
					e.end = this.edge_end(e, y);
				}
			}
			r = r.next;
		}

		let option;

		for (let i = 0; i < this.edges.length; i++) {
			e = this.edges[i];
			option =
				1 * this.point_outside(e.start) + 2 * this.point_outside(e.end);

			switch (option) {
				case 3: // Both endpoints outside the canvas
					this.edges[i] = null;
					break;
				case 1: // Start is outside
					e.start.y < e.end.y ? (y = 0) : (y = this.box_y);
					e.start = this.edge_end(e, y);
					break;
				case 2: // End is outside
					e.end.y <= e.start.y ? (y = 0) : (y = this.box_y);

					e.end = this.edge_end(e, y);
					break;
				default:
					break;
			}
		}
	}

	edge_end(e, y_lim) {
		let x = Math.min(this.box_x, Math.max(0, e.getX(y_lim)));
		let y = e.getY(x);
		if (!y) y = y_lim; // In this case the edge is vertical
		let p = new Point(x, y);
		this.voronoi_vertex.push(p);
		return p;
	}

	point_outside(p) {
		return p.x < 0 || p.x > this.box_x || p.y < 0 || p.y > this.box_y;
	}
}

export { VoronoiDiagram }