const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let cannonSfx = new Audio(
  'https://ia803405.us.archive.org/1/items/metal-block/Anti%20Aircraft%20Cannon-18363-Free-Loops.com.mp3'
);
let cannonTop = new Image();
cannonTop.src =
  'https://ia903407.us.archive.org/7/items/cannon_202104/cannon.png';
cannonTop.onload = renderImage;

let mousePos = null;
let angle = null;
let canShoot = true;
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
    this.gravity = 0.05;
    this.elasticity = 0.5;
    this.friction = 0.008;
    this.collAudio = new Audio(
      'https://archive.org/download/metal-block_202104/metal-block.wav'
    );
    this.collAudio.volume = 0.7;
    this.shouldAudio = true;
    this.timeDiff1 = null;
    this.timeDiff2 = new Date();
  }

  move() {
    // sort out the gravity
    if (this.y + this.gravity < 580) {
      this.dy += this.gravity;
    }

    //apply friction to x axis
    this.dx = this.dx - this.dx * this.friction;
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

function ballHitWall(ball) {
  //A collision has occured on any side of the canvas
  if (
    ball.x + ball.radius > 580 ||
    ball.x - ball.radius < 20 ||
    ball.y + ball.radius > 580 ||
    ball.y - ball.radius < 20
  ) {
    if (ball.timeDiff1) {
      ball.timeDiff2 = new Date() - ball.timeDiff1;
      ball.timeDiff2 < 200 ? (ball.shouldAudio = false) : null;
    }
    if (ball.shouldAudio) ball.collAudio.play();

    //Sort out elasticity & then change direction
    ball.dy = ball.dy * ball.elasticity;

    //Right side of ball hits right side of canvas
    if (ball.x + ball.radius > 580) {
      //We set the X & Y coordinates first to prevent ball from getting stuck in the canvas border
      ball.x = 580 - ball.radius;
      ball.dx *= -1;
    } else if (ball.x - ball.radius < 20) {
      //Left side of ball hits left side of canvas
      ball.x = 20 + ball.radius;
      ball.dx *= -1;
    } else if (ball.y + ball.radius > 580) {
      //Bottom of ball hits bottom of canvas
      ball.y = 580 - ball.radius;
      ball.dy *= -1;
    } else if (ball.y - ball.radius < 20) {
      //Top of ball hits top of canvas
      ball.y = 20 + ball.radius;
      ball.dy *= -1;
    }

    ball.timeDiff1 = new Date();
  }
}
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
    ballHitWall(ball);
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

  cannonSfx.currentTime = 0.2;
  cannonSfx.play();
  // can only shoot 1 second ata time
  setTimeout(() => {
    canShoot = true;
  }, 10);
});

// 24: 27
