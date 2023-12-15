var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

// c?.fillRect(x, y, width, height)  x and y is cordinates and it starts frrom the top left corner of the screen
for (let i = 0; i < 16; i++) {
  for (let j = 0; j < 16; j++) {
    if (j % 2 === 0 && i % 2 === 1) {
      c?.fillRect(j * 100, i * 100, 100, 100);
    } else {
      c?.fillRect(i * 100, j * 100, 100, 100);
    }
  }
}

console.log(canvas, c);

// the HTMLCanvasElement.getContext(contextType, contextAttribute)  method returns
// a drwaing context on the canvas , or null if the context identifier is not supported , or the canvas has already been set to a different context
