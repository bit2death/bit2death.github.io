/*
Frederick Schmidt
https://bit2death.github.io/
*/
// FOUND A BETTER TUTORIAL, EASIER (https://www.youtube.com/watch?v=9HOvkVQjGf8)

"use strict";

var VERTEXES = [
  [-0.5500000715255737, 0.0, 0.30000001192092896],
  [-0.45000001788139343, 0.0, 0.20000000298023224],
  [-0.45000001788139343, 0.0, 0.10000000149011612],
  [-0.15000000596046448, 0.0, 0.30000001192092896],
  [-0.45000001788139343, 0.0, 0.0],
  [-0.45000001788139343, 0.0, -0.10000000149011612],
  [-0.5500000715255737, 0.0, -0.20000000298023224],
  [-0.2500000298023224, 0.0, 0.20000000298023224],
  [-0.2500000298023224, 0.0, 0.30000001192092896],
  [-0.2500000298023224, 0.0, 0.10000000149011612],
  [-0.2500000298023224, 0.0, 0.0],
  [-0.2500000298023224, 0.0, -0.10000000149011612],
  [-0.2500000298023224, 0.0, -0.20000000298023224],
  [-0.15000000596046448, 0.0, -0.20000000298023224],
  [0.09999999403953552, 0.0, 0.30000001192092896],
  [0.14999999105930328, 0.0, 0.25],
  [0.14999999105930328, 0.0, 0.05000000074505806],
  [0.09999999403953552, 0.0, 0.0],
  [0.14999999105930328, 0.0, -0.20000000298023224],
  [0.04999998211860657, 0.0, -0.20000000298023224],
  [-0.050000011920928955, 0.0, 0.0],
  [-0.050000011920928955, 0.0, -0.20000000298023224],
  [-0.050000011920928955, 0.0, 0.20000000298023224],
  [-0.050000011920928955, 0.0, 0.10000000149011612],
  [0.04999998211860657, 0.0, 0.10000000149011612],
  [0.04999998211860657, 0.0, 0.20000000298023224],
  [-2.9802322387695312e-08, 0.0, 0.0],
  [0.25, 0.0, 0.29999998211860657],
  [0.25, 0.0, -0.19999998807907104],
  [0.5, 0.0, 0.29999998211860657],
  [0.5499999523162842, 0.0, 0.25],
  [0.5499999523162842, 0.0, 0.04999999701976776],
  [0.5, 0.0, 0.0],
  [0.5499999523162842, 0.0, -0.19999998807907104],
  [0.44999998807907104, 0.0, -0.19999998807907104],
  [0.3499999940395355, 0.0, 0.0],
  [0.3499999940395355, 0.0, -0.19999998807907104],
  [0.3499999940395355, 0.0, 0.19999998807907104],
  [0.3499999940395355, 0.0, 0.09999999403953552],
  [0.44999998807907104, 0.0, 0.09999999403953552],
  [0.44999998807907104, 0.0, 0.19999998807907104],
  [0.3999999761581421, 0.0, 0.0]
];

// triangles may be n-gons too, just depends on how many values are in each tri

var TRIANGLES = [
  [3, 22, 25, 15, 14],
  [16, 15, 25, 24, 23, 22, 3, 13, 21, 20, 26, 19, 18, 17],
  [2, 1, 7, 8, 0, 6, 12, 11, 5, 4, 10, 9],
  [27, 37, 40, 30, 29],
  [31, 30, 40, 39, 38, 37, 27, 28, 36, 35, 41, 34, 33, 32]
];

async function getMeshData(mesh){
  const response = await fetch(`./models/${mesh}.json`);
  const jsonData = await response.json();
  VERTEXES = jsonData[0];
  TRIANGLES = jsonData[1];
  console.log(jsonData)
}
getMeshData("suzanne")


window.onload = function(){
  document.getElementById("catalog").addEventListener("change", (e) => {
    getMeshData(e.target.options[e.target.selectedIndex].value)
  })
  loadCatalog();
}

async function loadCatalog(){
  const response = await fetch(`./models/_index.json`)
  const jsonData = await response.json();

  jsonData.forEach(e => {
    let temp = document.createElement("option")
    temp.value = e
    temp.innerHTML = e
    document.getElementById("catalog").appendChild(temp)
  })
  
}

var canvas = document.getElementById("canvas");
canvas.width = Math.min(window.innerWidth, 700);
canvas.height = Math.min(window.innerWidth, 700);
var ctx = canvas.getContext("2d");
ctx.lineWidth = .5;
ctx.strokeStyle = "#fff";

var FOV = canvas.width * .8;

function rotate(x, y, r){
  return [
    x * Math.cos(r.x) - y * Math.sin(r.x),
    x * Math.sin(r.x) + y * Math.cos(r.x)
  ];
};

var rot = {
  x: 0,
  y: 0
};
var mouseX = 0;
var mouseY = 0;

function main(){
  rot.x = rot.x + ((mouseX * 10/window.innerWidth -rot.x)/1.5)
  rot.y = rot.y + ((mouseY * 10/window.innerWidth -rot.y)/1.5)
  //  Clear screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //  Draw stuff
  for (let triangle = 0; triangle < TRIANGLES.length; triangle++){
    let points = [];
    for (let vertex = 0; vertex<TRIANGLES[triangle].length; vertex++){
      // Get the X, Y, Z coord out of the vertex thing
      let x = VERTEXES[TRIANGLES[triangle][vertex]][0],
      y = VERTEXES[TRIANGLES[triangle][vertex]][1],
      z = VERTEXES[TRIANGLES[triangle][vertex]][2];
      // Rotate
      // the "f" means final
      let xf = rotate(x, z, rot)[0];
      let zf = rotate(x, z, rot)[1];

      let yf = rotate(y, zf, rot)[0];
          zf = rotate(y, zf, rot)[1];

      let xff = rotate(xf, yf, rot)[0];
      let yff = rotate(xf, yf, rot)[1];

      // Perspective formula
      zf += 3;
      let f = FOV / zf;
      let sx = xff * f + canvas.width/2;
      let sy = yff * f + canvas.height/2;

      // Add point
      points.push([sx, sy]);
    }
    // Draw triangle
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for(let i=1;i<TRIANGLES[triangle].length; i++)
      ctx.lineTo(points[i][0], points[i][1]);
    ctx.lineTo(points[0][0], points[0][1]);
    ctx.stroke();
    ctx.closePath();
  }
}

window.setInterval(main, 16.7)

document.addEventListener("mousemove", e => {mouseX = e.x; mouseY = e.y})
