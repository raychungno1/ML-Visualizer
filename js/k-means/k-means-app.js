import { Point } from "./point.js"
import { gaussianRand } from "./gaussian.js";
import { KMeans } from "./k-means.js"
import { VoronoiDiagram  } from "./vor.js"

const canvas = document.querySelector("canvas");
const canvasContainer = document.getElementById("canvas")
canvas.width = canvasContainer.getBoundingClientRect().width;
canvas.height = window.innerHeight / 2;

const trainBtn = document.getElementById("train");
const resetBtn = document.getElementById("reset");
const closeBtn = document.querySelector(".close-btn");
closeBtn.addEventListener("click", () => closeBtn.parentNode.remove());

window.addEventListener("resize", function() {
    canvas.width = canvasContainer.getBoundingClientRect().width;
    canvas.height = window.innerHeight / 2;
    model = init(c);
})

var mouse = {
    x: undefined,
    y: undefined
}
window.addEventListener("mousemove", function(event) {
    mouse.x = event.x
    mouse.y = event.y
})

canvas.addEventListener("click", canvasClick);

function canvasClick() {
    let canvasRect = canvas.getBoundingClientRect();
    let x = mouse.x - canvasRect.left;
    let y = mouse.y - canvasRect.top;
    if (x > 3 && x < canvas.width - 3 &&
        y > 3 && y < canvas.height - 3) {
            model.addCenters([x, y]);
            let color = "#" + Math.floor(Math.random()*16777215).toString(16);
            while (colors.includes(color)) color = "#" + Math.floor(Math.random()*16777215).toString(16);
            colors.push(color);
            drawModel(c, model);
    }
}

resetBtn.addEventListener("click", reset);

function reset() {
    model = init(c);
}

trainBtn.addEventListener("click", train);

function train() {
    model.animateCluster(500, c, colors, canvas, canvasClick, resetBtn, reset, trainBtn, train);
}

function init(c) {
    let points = [] // Generate 5-10 clusters
    let numClusters = Math.floor(Math.random() * 5 + 5);
    for (let i = 0; i < numClusters; i++) {
        let radius = 3;
        let clusterCenter = [
            (Math.random() * (canvas.width - 2*radius)) + radius,
            (Math.random() * (canvas.height - (2*radius))) + radius
        ];

        // Clusters can have 10-40 points
        let clusterSize = Math.floor(Math.random() * 40) + 10;
        let clusterVariance = Math.floor((Math.random() + 0.2) * canvas.height);
        for (let i = 0; i < clusterSize; i++) {
            let x = clusterCenter[0] + (gaussianRand() - 0.5) * clusterVariance;
            let y = clusterCenter[1] + (gaussianRand() - 0.5) * clusterVariance;
            if (x > 3 && x < canvas.width - 3 &&
                y > 3 && y < canvas.height - 3)
                points.push([x, y]);
        }
    }
    let model = new KMeans();
    model.addData(...points);
    drawModel(c, model);
    return model;
}

function drawModel(c, model) {
    c.clearRect(0, 0, innerWidth, innerHeight)
    model.data.forEach((point, i) => new Point(...point).drawData(c, colors[model.labels[i]]));
    model.centers.forEach((center, i) => new Point(...center).drawCenter(c, colors[i]));
    
    if (model.centers.length) {
        let vor = new VoronoiDiagram(model.centers.map(point => new Point(...point)), canvas.width, canvas.height);
        vor.update();
        vor.edges.forEach(edge => { if (edge) edge.draw(c) });
    }
}

let c = canvas.getContext("2d");
let colors = [];
let model = init(c);
