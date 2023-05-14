let canvas = document.getElementById('canvas');
let resetButton = document.getElementById('reset-button');
let ant_alg = document.getElementById('ant_alg');
let context = canvas.getContext('2d');
let points = [];
let distanceMatrix = [];
let pheromones = [];
let alpha = 1;
let beta = 5;
let evaporation = 1;
let ants = 120;
let ant = [{
    path: [],
    distance: 0
}];
let visited = [];
let endPath = Infinity;
let feromon = [];
let ant_paths = [];
let total_dist = [];
let Index;
let iterrations = 200;
let delta;
let Q = 40;
canvas.addEventListener('click', (event) => {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    points.push({x: x, y: y});
    drawPoints();
});

resetButton.addEventListener('click', () => {
    points = [];
    context.clearRect(0, 0, canvas.width, canvas.height);
});

ant_alg.addEventListener('click', () => {
    distanceMatrix = Distances();
    let count = 0;
    let counter = 0;
    let arrayPoints = [];
    for (let k = 0; k < 100; k++){
        for (let i = 0; i < ants; i++){
            if (count == points.length){
                count = 0;
            }
            CurrentPoint = count;
            arrayPoints = [];
            visited = [];
            for (let j = 0; j < points.length - 1; j++)
            {
                arrayPoints.push(CurrentPoint);
                visited.push(CurrentPoint);
                CurrentPoint = getNextCity(CurrentPoint, pheromones, distanceMatrix, visited);
            }
            arrayPoints.push(CurrentPoint);
            ant[counter] = ({path: arrayPoints, distance: 0});
            count++;
            counter++;
        }
        for (let i=0; i < ant.length; i++){
            ant[i].distance = GetLength(ant[i].path, points);
            if (endPath > ant[i].distance){
                endPath = ant[i].distance;
                Index = i;
            }
        }
        pheromones = UptadePheromone(pheromones, ant, points, Q);
    }
    Draw(ant[Index].path, points);
    console.log(arrayPoints);
});

function drawPoints() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#FF0000';

    for (let i = 0; i < points.length; i++) {
      context.beginPath();
      context.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2);
      context.fill();
    }
}

function getDistance(point1, point2) {
    let dx = point2.x - point1.x;
    let dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Distances(){
    for (let i=0; i < points.length;i++){
        distanceMatrix[i] = new Array(points.length);
        pheromones[i] = new Array(points.length);
        for (let j=0; j < points.length; j++){
            if (getDistance(points[i], points[j])) {
                distanceMatrix[i][j] = getDistance(points[i], points[j]);
                pheromones[i][j] = 0.2;
            }
            else{
                distanceMatrix[i][j] = 0;
                pheromones[i][j] = 0.2;
            }

        }
    }
    console.log(distanceMatrix);
    return distanceMatrix;
}

function UptadePheromone(pheromones, ant, points, Q){
    for (let i=0; i < points.length; i++){
        for (let j=0; j < points.length; j++){
            if(i!=j)
            pheromones[i][j] = evaporation * pheromones[i][j];
        }
    }
    let delta;
    let OurPath;
    for (let j = 0; j < ant.length; j++){
        delta = Q / ant[j].distance;
        OurPath = [...ant[j].path];
        for (let i = 0; i < points.length - 1; i++)
        {
            pheromones[OurPath[i]][OurPath[i+1]] = pheromones[OurPath[i]][OurPath[i+1]] + delta;
            pheromones[OurPath[i + 1]][OurPath[i]] = pheromones[OurPath[i + 1]][OurPath[i]] + delta;
        }
    }
    return pheromones;
}

function getNextCity(CurrentPoint, pheromones, distanceMatrix, visited) { 
    let prob = [];
    let totalProbability = 0;
    for (let i = 0; i < points.length; i++){
        if (!visited.includes(i) && i!==CurrentPoint){
            let visibility = 1 / distanceMatrix[CurrentPoint][i];
            let pheromoneL = pheromones[CurrentPoint][i];
            let probability = visibility * pheromoneL;

            prob.push({city:i, probability:probability });
            totalProbability += probability;
        }
    }

    for (let i = 0; i < prob.length; i++){
        prob[i].probability /= totalProbability;
    }

    let rouletteWheel = Math.random();

    for (let i = 0; i < prob.length; i++) {
        let probability = prob[i].probability;
        rouletteWheel -= probability;

        if (rouletteWheel <= 0) {
            return prob[i].city;
        }
    }
}

function Draw(path, points) {
    context.strokeStyle = "#fff";

    for(let i = 0; i < points.length-1 ;i++) {
      context.beginPath();
      context.moveTo(points[path[i]].x, points[path[i]].y);
      context.lineTo(points[path[i+1]].x, points[path[i+1]].y);
      context.stroke();
    }

    context.beginPath();
    context.moveTo(points[path[path.length-1]].x, points[path[path.length-1]].y);
    context.lineTo(points[path[0]].x, points[path[0]].y);
    context.stroke();
}

function GetLength(path, points) {
    let TotalDist = 0;
    let dx;
    let dy;

    for(let i = 0; i < points.length-1; i++) {
      dx = points[path[i+1]].x - points[path[i]].x;
      dy = points[path[i+1]].y - points[path[i]].y;
      TotalDist += Math.sqrt(dx * dx + dy * dy);
    }

    dx = points[path[0]].x - points[path[points.length-1]].x;
    dy = points[path[0]].y - points[path[points.length-1]].y;
    TotalDist+= Math.sqrt(dx * dx + dy * dy);

    return TotalDist;
  }

function Ant_algorithm(){
    distanceMatrix = Distances();
    let count = 0;
    let counter = 0;
    let arrayPoints = [];
    for (let k = 0; k < 100; k++){
        for (let i = 0; i < ants; i++){
            if (count == points.length){
                count = 0;
            }
            CurrentPoint = count;
            arrayPoints = [];
            visited = [];
            for (let j = 0; j < points.length - 1; j++)
            {
                arrayPoints.push(CurrentPoint);
                visited.push(CurrentPoint);
                CurrentPoint = getNextCity(CurrentPoint, pheromones, distanceMatrix, visited);
            }
            arrayPoints.push(CurrentPoint);
            ant[counter] = ({path: arrayPoints, distance: 0});
            count++;
            counter++;
        }
        for (let i=0; i < ant.length; i++){
            ant[i].distance = GetLength(ant[i].path, points);
            if (endPath > ant[i].distance){
                endPath = ant[i].distance;
                Index = i;
            }
        }
        pheromones = UptadePheromone(pheromones, ant, points, Q);
    }
    for (let i=0; i < ant.length; i++){
        ant[i].distance = GetLength(ant[i].path, points);
        if (endPath > ant[i].distance){
            endPath = ant[i].distance;
            Index = i;
        }
    }
    Draw(ant[Index].path, points);
    console.log(arrayPoints);
}