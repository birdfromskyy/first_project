let canvas = document.getElementById('canvas');
let resetButton = document.getElementById('reset-button');
let clusterButton = document.getElementById('cluster-button');
let context = canvas.getContext('2d');
let points = [];

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

clusterButton.addEventListener('click', () => {
  let clusters = kMeansClustering(points, 11);
  drawClusters(clusters);
});

function drawPoints() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#ffc107';

  for (let i = 0; i < points.length; i++) {
    context.beginPath();
    context.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2);
    context.fill();
  }
}

function drawClusters(clusters) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  let colors = ['#0000FF', '#FF00FF', '#800080', '#FF0000', '#00FF00', '#008000', '#00FFFF', '#000000', '#FFFFFF', '#808080', '#FFFF00'];

  for (let i = 0; i < clusters.length; i++) {
    let color = colors[i];
    let clusterPoints = clusters[i];
    let center = getCenter(clusterPoints);
    context.fillStyle = color;

    for (let j = 0; j < clusterPoints.length; j++) {
      let point = clusterPoints[j];
      context.beginPath();
      context.arc(point.x, point.y, 5, 0, Math.PI * 2);
      context.fill();
    }

    context.fillStyle = '#fff';
    context.beginPath();
    context.arc(center.x, center.y, 10, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = color;
    context.beginPath();
    context.arc(center.x, center.y, 5, 0, Math.PI * 2);
    context.fill();
  }
}

function getCenter(points) {
  let center = { x: 0, y: 0 };

  for (let i = 0; i < points.length; i++) {
    center.x += points[i].x;
    center.y += points[i].y;
  }

  center.x /= points.length;
  center.y /= points.length;
  return center;
}

function kMeansClustering(points, k) {
  let clusters = [];

  for (let i = 0; i < k; i++) {
    clusters.push([]);
  }

  let centers = [];

  for (let i = 0; i < k; i++) {
    centers.push({x: Math.random() * canvas.width, y: Math.random() * canvas.height});
  }

  let iterations = 0;

  while (iterations < 100) {
    for (let i = 0; i < k; i++) {
      clusters[i] = [];
    }

    for (let i = 0; i < points.length; i++) {
      let minDistance = Infinity;
      let minClusterIndex = -1;
      for (let j = 0; j < k; j++) {
        let distance = getDistance(points[i], centers[j]);
        if (distance < minDistance) {
          minDistance = distance;
          minClusterIndex = j;
        }
      }
      clusters[minClusterIndex].push(points[i]);
    }

    for (let i = 0; i < k; i++) {
      let sumX = 0;
      let sumY = 0;

      for (let j = 0; j < clusters[i].length; j++) {
        sumX += clusters[i][j].x;
        sumY += clusters[i][j].y;
      }
      if (clusters[i].length > 0) {
        centers[i].x = sumX / clusters[i].length;
        centers[i].y = sumY / clusters[i].length;
      }
    }
    iterations++;
  }
  return clusters;
}

function getDistance(point1, point2) {
  let dx = point2.x - point1.x;
  let dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}