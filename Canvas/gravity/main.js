const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let cannonTop = new Image();
cannonTop.src =
  'https://ia903407.us.archive.org/7/items/cannon_202104/cannon.png';
cannonTop.onload = renderImage;
let imageCount = 1;

// start the application before the immage load
function renderImage() {
  if (--imageCount > 0) {
    return;
  }
  // call the animate when all the images have been loaded
  animate();
}
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

  draw() {
    this.stand();

    ctx.drawImage(cannonTop, this.topX, this.topY, 100, 50);
  }
}

let cannon = new Canon(80, 580);
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw a border
  drawBorder();
  cannon.draw();
}

// 12:29
