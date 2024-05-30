const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const crimeDataPath = path.join(__dirname, 'crimeData.json');
const getCrimeData = () => JSON.parse(fs.readFileSync(crimeDataPath, 'utf8'));

function dijkstra(graph, startNode) {
  const distances = {};
  const visited = {};
  const previous = {};

  for (let node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }

  distances[startNode] = 0;

  while (Object.keys(visited).length !== Object.keys(graph).length) {
    const currentNode = Object.keys(distances).reduce((minNode, node) => {
      if (minNode === null || distances[node] < distances[minNode]) {
        if (!visited[node]) {
          minNode = node;
        }
      }
      return minNode;
    }, null);

    for (let neighbor in graph[currentNode]) {
      const newDistance = distances[currentNode] + graph[currentNode][neighbor];
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = currentNode;
      }
    }

    visited[currentNode] = true;
  }

  return { distances, previous };
}

app.get('/api/optimized-route', (req, res) => {
  try {
    const hotspots = getCrimeData();
    const graph = {};
    hotspots.forEach((hotspot, i) => {
      graph[i] = {};
      hotspots.forEach((otherHotspot, j) => {
        if (i !== j) {
          const distance = Math.sqrt(
            Math.pow(hotspot.lat - otherHotspot.lat, 2) + Math.pow(hotspot.lng - otherHotspot.lng, 2)
          );
          graph[i][j] = distance;
        }
      });
    });

    const startNode = 0;
    const { previous } = dijkstra(graph, startNode);

    let path = [];
    let currentNode = hotspots.length - 1;
    while (currentNode !== null) {
      path.push(hotspots[currentNode]);
      currentNode = previous[currentNode];
    }
    path.reverse();

    res.json(path);
  } catch (error) {
    console.error('Error optimizing route:', error);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


