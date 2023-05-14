function createCanvas() {
  let widthInput = document.getElementById("width");
  let heightInput = document.getElementById("height");
  let width = widthInput.value;
  let height = heightInput.value;
  let canvas = document.getElementById("Canvas");
  canvas.width = width;
  canvas.height = height;
  let ctx = canvas.getContext("2d");
  canvas.style.border = "#222";
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, width, height);
}

let canvas = document.getElementById("Canvas");
let ctx = canvas.getContext("2d");
let points = [];

canvas.addEventListener("click", function(event) {
  let x = event.offsetX;
  let y = event.offsetY;
  points.push({ x: x, y: y });
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
});

let Pop = [];
let Dist = [];
let Startpop = 1000;
let MaxIterations = 20000;
let last = 0;
let count = 0;

function Crossover(FirstParent, SecondParent) {
  let BreakPoint = Math.floor(Math.random() * FirstParent.length);
  let son = [];

  for(let i = 0; i < BreakPoint;i++)
    son[i] = FirstParent[i];

  for(let i = BreakPoint;i < FirstParent.length ;i++) {
    if(!son.includes(SecondParent[i])) {
      son.push(SecondParent[i]);
    }
  }

  for(let i = 0; i < FirstParent.length;i++)
    if(!son.includes(FirstParent[i]))
      son.push(FirstParent[i]);

  return son;
}

function GetLength(chromosome, points) {
  let TotalDist = 0;
  let dx;
  let dy;

  for(let i = 0;i < points.length-1;i++) {
    dx = points[chromosome[i+1]].x - points[chromosome[i]].x;
    dy = points[chromosome[i+1]].y - points[chromosome[i]].y;
    TotalDist += Math.sqrt(dx * dx + dy * dy);
  }

  dx = points[chromosome[0]].x - points[chromosome[points.length-1]].x;
  dy = points[chromosome[0]].y - points[chromosome[points.length-1]].y;
  TotalDist+= Math.sqrt(dx * dx + dy * dy);

  return TotalDist;
}

function Draw(Chromosome, points) {
  ctx.strokeStyle = "#fff";

  for(let i = 0; i < points.length-1 ;i++) {
    ctx.beginPath();
    ctx.moveTo(points[Chromosome[i]].x, points[Chromosome[i]].y);
    ctx.lineTo(points[Chromosome[i+1]].x, points[Chromosome[i+1]].y);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(points[Chromosome[Chromosome.length-1]].x, points[Chromosome[Chromosome.length-1]].y);
  ctx.lineTo(points[Chromosome[0]].x, points[Chromosome[0]].y);
  ctx.stroke();
}

function Genetic() {
  count = 0;
  let Tmpmassiv = [];
  for (let i = 0; i < points.length; i++) {
      Tmpmassiv[i] = i;
  }

  for (let i = 0; i < Startpop; i++) {
      let Tmpmassiv1 = [...Tmpmassiv];
      for (let j = 0; j < points.length; j++) {
          let R1 = Math.floor(Math.random() * (points.length));
          let R2 = Math.floor(Math.random() * (points.length));
          let Temp = Tmpmassiv1[R1];
          Tmpmassiv1[R1] = Tmpmassiv1[R2];
          Tmpmassiv1[R2] = Temp;
      }
      Pop.push(Tmpmassiv1);
  }

  for (let k = 0; k < MaxIterations; k++) {
      if (count === 4000) {
          break;
      }
      let R1 = Math.floor(Math.random() * (Pop.length));
      let R2 = Math.floor(Math.random() * (Pop.length));

      let son = Crossover(Pop[R1], Pop[R2]);
      Pop.push(son);
      son = Crossover(Pop[R2], Pop[R1]);
      Pop.push(son);
      for (let i = 0; i < Pop.length; i++) {
          Dist[i] = GetLength(Pop[i], points);
      }

      let c = 0;
      while (c != Dist.length - 1) {
          c = 0;
          for (let i = 0; i < Dist.length - 1; i++) {
              if (Dist[i] > Dist[i + 1]) {
                  let temp = Dist[i];
                  Dist[i] = Dist[i + 1];
                  Dist[i + 1] = temp;
                  temp = Pop[i];
                  Pop[i] = Pop[i + 1];
                  Pop[i + 1] = temp;
              } else {
                  c += 1;
              }
          }
      }
      if (last === Dist[0]) {
          count++;
      } else {
          count = 0;
      }
      last = Dist[0];

      Dist.pop();
      Pop.pop();
      Dist.pop();
      Pop.pop();
  }
  Draw(Pop[0], points);
}