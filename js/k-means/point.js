class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
        this.color = "#101A26"
	}

    drawData(c, color) {
        c.beginPath();
        c.arc(this.x, this.y, 4, 0, Math.PI * 2, false);
        c.globalAlpha = 0.5;
        c.fillStyle = color || this.color;
        c.fill();
        c.globalAlpha = 1;
        return this;
    }

    drawCenter(c, color) {
        c.beginPath();
        c.arc(this.x, this.y, 10, 0, Math.PI * 2, false);
        c.fillStyle = color || this.color;
        c.shadowColor = "black";
        c.shadowBlur = 10;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
        c.fill();
        // c.stroke();
        c.shadowColor = this.color;
        c.shadowBlur = 0;
        return this;
    }

    toArr() {
        return [this.x, this.y];
    }
}

export { Point }