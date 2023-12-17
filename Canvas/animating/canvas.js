var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');
// c.fillStyle = 'rgba(255, 0, 0, 0.5)';
// c.fillRect(100, 100, 100, 100);
// c.fillStyle = 'rgba(255, 100, 0, 0.5)';
// c.fillRect(300, 100, 100, 100);
// c.fillStyle = 'rgba(255, 200, 0, 0.5)';
// c.fillRect(500, 100, 100, 100);
// c.fillStyle = 'rgba(255, 150, 40, 0.5)';
// c.fillRect(200, 200, 100, 100);
// c.fillStyle = 'rgba(255, 30, 160, 0.5)';
// c.fillRect(400, 200, 100, 100);
// c?.fillRect(x, y, width, height)  x and y is cordinates and it starts frrom the top left corner of the screen

// console.log(canvas, c);
// document.addEventListener('mousemove', ({ x, y }) => {
//   let pos = { x, y };
//   console.log(pos);
// });
// the HTMLCanvasElement.getContext(contextType, contextAttribute)  method returns
// a drwaing context on the canvas , or null if the context identifier is not supported , or the canvas has already been set to a different context

// line

// c.beginPath();
// c.moveTo(500, 300);
// c.lineTo(600, 200);
// c.lineTo(500, 100);
// c.lineTo(300, 300);
// c.lineTo(100, 100);
// c.lineTo(100, 300);
// c.lineTo(300, 100);
// c.lineTo(500, 300);
// c.strokeStyle = '#fa34a3';
// c.stroke();

// arc \ circle
// c.beginPath(); // it prevents then from connecting with another
// c.arc(300, 300, 30, 0, Math.PI * 2, false);
// c.strokeStyle = 'blue';
// c.fillStyle = 'green';
// c.stroke();

// for (let i = 1; i <= 5; i++) {
//   c.beginPath(); // it prevents then from connecting with another
//   c.arc(100 * i, 300, 50, 0, Math.PI * 2, true);
//   c.strokeStyle = 'blue';
//   c.fillStyle = 'green';
//   c.stroke();
// }
function hex() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
class Circle {
  constructor(x, y, rad, dx, dy) {
    this.x = x;
    this.y = y;
    this.rad = rad;
    this.dx = dx;
    this.dy = dy;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.rad, Math.PI * 2, false);
    c.stroke();
  }
  update(color) {
    c.strokeStyle = color;
    c.fillStyle = color;
    c.fill();
    if (this.x + this.rad > innerWidth || this.x - this.rad < 0) {
      this.dx = -this.dx;
    } else if (this.y + this.rad > innerHeight || this.y - this.rad < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  }
}

let circleArr = [];
for (let i = 0; i < 30; i++) {
  // sizes
  var rad = 10 + Math.random() * 40;
  var x = Math.random() * (innerWidth - rad * 2) + rad;
  var dx = (Math.random() - 0.5) * 6;
  var y = Math.random() * (innerHeight - rad * 2) + rad;
  var dy = (Math.random() - 0.5) * 8;
  //  sizes end
  circleArr.push(new Circle(x, y, rad, dx, dy));
}

console.log(circleArr);

function animate() {
  c.clearRect(0, 0, innerWidth, innerHeight);
  requestAnimationFrame(animate);
  for (let i = 0; i < circleArr.length; i++) {
    var color = hex();
    circleArr[i].update(color);
  }
}
animate();
