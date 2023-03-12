const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const radius = 50;

let balls = [];

function createBalls(numberBalls, canvasWidth, canvasHeight) {
    for (let i = 0; i < numberBalls; i++) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        const dx = Math.random() * 4 - 2 / 2;
        const dy = Math.random() * 4 - 2 / 2;
        balls.push({ x, y, radius, dx, dy });
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fill();
}

function drawBalls() {
    balls.forEach(ball => drawBall(ball));
}

function drawLine(ball1, ball2) {
    ctx.beginPath();
    ctx.moveTo(ball1.x, ball1.y);
    ctx.lineTo(ball2.x, ball2.y);
    ctx.stroke();
}

function checkCollision() {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const ball1 = balls[i];
      const ball2 = balls[j];
      const distance = Math.sqrt((ball1.x - ball2.x) ** 2 + (ball1.y - ball2.y) ** 2);

      if (distance < document.getElementById('min-distance').value) {
        drawLine(ball1, ball2);
      }
    }
  }
}

function updateBalls(canvasWidth, canvasHeight) {
    balls.forEach(ball => {
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvasWidth) {
        ball.dx = -ball.dx;
      }
  
      if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvasHeight) {
        ball.dy = -ball.dy;
      }
  
      ball.x += ball.dx;
      ball.y += ball.dy;
    });
}

function loop() {
    clearCanvas();
    drawBalls();
    checkCollision();
    updateBalls(canvas.width, canvas.height);
    requestAnimationFrame(loop);
}

function handleCanvasClick(event) {
        balls.forEach((ball, index) => {
        const distance = Math.sqrt((ball.x - event.offsetX) ** 2 + (ball.y - event.offsetY) ** 2);

        if (distance < ball.radius) {
        balls.splice(index, 1);
        addNewBalls();
        }
    });
}

document.getElementById('start-button').addEventListener('click', () => {
    const numberBalls = document.getElementById('number-balls').value;
    const canvasWidthInput = document.getElementById('canvas-width');
    const canvasHeightInput = document.getElementById('canvas-height');

    canvas.removeEventListener('click', handleCanvasClick);

    canvas.width = parseInt(canvasWidthInput.value);
    canvas.height = parseInt(canvasHeightInput.value);

    balls = [];

    createBalls(numberBalls, canvasWidthInput.value, canvasHeightInput.value);
    loop();
    
});

document.getElementById('reset-button').addEventListener('click', () => {
    clearCanvas();
    document.getElementById('num-balls');
    document.getElementById('min-distance');
    document.getElementById('canvas-width');
    document.getElementById('canvas-height');
    balls = [];
});

