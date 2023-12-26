const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let cannonTop = new Image();
cannonTop.src =
  'https://ia903407.us.archive.org/7/items/cannon_202104/cannon.png';
cannonTop.onload = renderImage;

let mousePos = null;
let angle = null;
let canShoot = false;
// start the application before the immage load

function drawBorder() {
  ctx.fillStyle = '#006666';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.clearRect(20, 20, 560, 560);
}
class Canon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.topX = x - 20;
    this.topY = y - 95;
  }

  stand() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + 15, this.y - 50);
    ctx.lineTo(this.x + 30, this.y);
    ctx.stroke();
  }
  rotateTop() {
    if (mousePos) {
      angle = Math.atan2(
        mousePos.y - (this.y - 50),
        mousePos.x - (this.x + 15)
      );
      ctx.translate(this.x + 15, this.y - 50);
      ctx.rotate(angle);
      ctx.translate(-(this.x + 15), -(this.y - 50));
    }
  }

  draw() {
    //Draw the stand first
    this.stand();
    ctx.save();
    //Then draw the cannon
    this.rotateTop();
    ctx.drawImage(cannonTop, this.topX, this.topY, 100, 50);
  }
}

let cannon = new Canon(80, 580);

class CannonBall {
  constructor(angle, x, y) {
    this.radius = 15;
    this.mass = this.radius;
    this.angle = angle;
    this.x = x;
    this.y = y;
    this.dx = Math.cos(angle) * 7;
    this.dy = Math.sin(angle) * 7;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  draw() {
    //Set next offsets to normal offsets
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

let cannonBalls = [];

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //Draw Border first
  drawBorder();
  //Moving Canvas Graphics
  cannon.draw();
  ctx.restore();

  cannonBalls.forEach((ball) => {
    // move the balls
    ball.move();

    // render the ball to canvvas
    ball.draw();
  });
}

let imageCount = 1;
function renderImage() {
  if (--imageCount > 0) {
    return;
  }
  // call the animate when all the images have been loaded
  animate();
}
function sortBallsPos(x, y) {
  let rotatedAngle = angle;
  // work out distance between rotation point and canno nozzle
  let dx = x - (cannon.x + 15);
  let dy = y - (cannon.y - 50);
  let distance = Math.sqrt(dx ** 2 + dy ** 2);
  let originalAngle = Math.atan2(dy, dx);

  //Work out new positions
  let newX = cannon.x + 15 + distance * Math.cos(originalAngle + rotatedAngle);
  let newY = cannon.y - 50 + distance * Math.sin(originalAngle + rotatedAngle);

  return {
    x: newX,
    y: newY,
  };
}

// mouse has moved

canvas.addEventListener('mousemove', (e) => {
  mousePos = {
    x: e.clientX - canvas.offsetLeft,
    y: e.clientY - canvas.offsetTop,
  };
});

canvas.addEventListener('click', (e) => {
  if (angle < -2 || angle > 0.5) return;
  if (!canShoot) return;
  canShoot = false;

  let ballsPos = sortBallsPos(cannon.topX + 100, cannon.topY + 30);
  cannonBalls.push(new CannonBall(angle, ballsPos.x, ballsPos.y));

  // can only shoot 1 second ata time
  setTimeout(() => {
    canShoot = true;
  }, 1000);
});

// 24: 27
