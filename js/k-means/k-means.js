import { Point } from "./point.js";
import { VoronoiDiagram } from "./vor.js"

class KMeans {
    constructor() {
        this.data = [];
        this.labels = [];
        this.centers = [];
        this.isClustered = false;
    }

    addData(...dataArr) {
        this.data.push(...dataArr);
        this.isClustered = false;
    }

    clearData() {
        this.data = [];
        this.labels = [];
        this.isClustered = true;
    }

    addCenters(...centerArr) {
        this.centers.push(...centerArr);
        this.isClustered = false;
    }

    clearCenters() {
        this.centers = [];
        this.isClustered = false;
    }

    cluster() {
        if (!this.centers.length) return;

        this.labels = [];
        let prevLabels; // Repeat until point assignments don't change
        while (!this.labels.length || this.labels.some((val, index) => val !== prevLabels[index])) {

            // Save copy of old labels
            prevLabels = JSON.parse(JSON.stringify(this.labels));
            
            let centerAssignments = []; // Save center assignments
            for (let i = 0; i < this.centers.length; i++) centerAssignments.push([]);
            
            this.labels = []; // Update cluster assignments
            for (let x of this.data) {
                let label = this.predict(x)
                this.labels.push(label);
                centerAssignments[label].push(x);
            }

            // Update cluster centers
            for (let i = 0; i < this.centers.length; i++) {
                let newCenter = KMeans.averageData(centerAssignments[i]);
                if (newCenter) this.centers[i] = newCenter;
            }
        }
        this.isClustered = true;
    }

    // Animates KMeans iterations while solving
    animateCluster(delay, c, colors, canvas, canvasClick, resetBtn, reset, trainBtn, train) {
        if (!this.centers.length) return; // if there are no centers
        
        this.labels = [];
        let prevLabels, centerAssignments;
        canvas.removeEventListener("click", canvasClick);
        resetBtn.removeEventListener("click", reset);
        trainBtn.removeEventListener("click", train);

        // setTimeout serves as the while loop
        let timerId = setTimeout(function iter(prevLabels, mode) {
            
            let oldCenters = JSON.parse(JSON.stringify(this.centers));

            if (mode) { // Reassigning points
                ({prevLabels, centerAssignments} = this.assignPoints(prevLabels));
                c.clearRect(0, 0, innerWidth, innerHeight)
                this.data.forEach((point, i) => new Point(...point).drawData(c, colors[this.labels[i]]));
                this.centers.forEach((center, i) => new Point(...center).drawCenter(c, colors[i]));
        
                if (this.centers.length) {
                    let vor = new VoronoiDiagram(this.centers.map(point => new Point(...point)), canvas.width, canvas.height);
                    vor.update();
                    vor.edges.forEach(edge => { if (edge) edge.draw(c) });
                }

            } else { // Updating centers
                this.updateCenter(centerAssignments);
                let millisecondsPerFrame = 1000 / 30;
                let frames = delay / millisecondsPerFrame;
                let dC = this.centers.map((center, i) => [(center[0] - oldCenters[i][0]), (center[1] - oldCenters[i][1])]);
                let vor = new VoronoiDiagram(oldCenters.map(point => new Point(...point)), canvas.width, canvas.height);

                // Smoothly animate the new center positions
                for (let i = 0; i < frames; i++) {
                    setTimeout(function draw() {
                        c.clearRect(0, 0, innerWidth, innerHeight)
                        this.data.forEach((point, j) => new Point(...point).drawData(c, colors[this.labels[j]]));

                        vor.point_list.forEach((point, j) => {
                            point.x = oldCenters[j][0] + KMeans.easeInOutQuint(i / frames) * dC[j][0];
                            point.y = oldCenters[j][1] + KMeans.easeInOutQuint(i / frames) * dC[j][1];
                            point.drawCenter(c, colors[j]);
                        });
                        vor.update();
                        vor.edges.forEach(edge => { if (edge) edge.draw(c) });
                    }.bind(this), i * frames);
                }
            }

            // Repeat until point assignments don't change
            if (!this.labels.length || this.labels.some((val, index) => val !== prevLabels[index])) {
                timerId = setTimeout(iter.bind(this, prevLabels, 1-mode), delay);
            } else {
                canvas.addEventListener("click", canvasClick);
                resetBtn.addEventListener("click", reset);
                trainBtn.addEventListener("click", train);
            }
        }.bind(this, prevLabels, 1), delay);
    }

    // Assign each point to it's closest label
    assignPoints(prevLabels) {
        // Save copy of old labels
        prevLabels = JSON.parse(JSON.stringify(this.labels));

        let centerAssignments = []; // Save center assignments
        for (let i = 0; i < this.centers.length; i++) centerAssignments.push([]);
        
        this.labels = []; // Update cluster assignments
        for (let x of this.data) {
            let label = this.predict(x)
            this.labels.push(label);
            centerAssignments[label].push(x);
        }
        return { prevLabels, centerAssignments };
    }

    // Update cluster centers
    updateCenter(centerAssignments) {
        for (let i = 0; i < this.centers.length; i++) {
            let newCenter = KMeans.averageData(centerAssignments[i]);
            if (newCenter) this.centers[i] = newCenter;
        }
    }

    // Easing function for animation
    static easeInOutQuint(x) {
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
    }

    // Makes a prediction based off of a point
    predict(x) {
        let distances = this.centers.map(c => KMeans.dist(x, c));
        let label = distances.indexOf(Math.min(...distances));
        return label;
    }

    // Calculates euclidian distance
    static dist(x, y) {
        return Math.sqrt((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2)
    }

    // Returns the average of each dimension in a 2d array
    static averageData(arr) {
        if (arr.length === 0) return;

        let sum = new Array(arr[0].length).fill(0);
        arr.forEach(data => 
            data.forEach((val, i) => sum[i] += val)
        );
        return sum.map(val => val / arr.length);
    }
}

export { KMeans }
