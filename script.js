const score_el = document.getElementById("score");
const highest_score_el = document.getElementById("highest-score");
const restart = document.getElementById('restart-btn');
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 7;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;

let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 0;

let appleX = Math.floor(Math.random() * tileCount);
let appleY = Math.floor(Math.random() * tileCount);

let xDirection = 0;
let yDirection = 0;

let score = 0;
let highest_score = JSON.parse(localStorage.getItem('highest')) || 0;

const gulpSound = new Audio("./audio/gulp.mp3");

// game loop
function drawGame() {
  changeSnakePosition();
  let result = isGameOver();
  if (result) return;

  clearScreen();
  checkAppleCollision();
  drawApple();
  drawSnake();
  updateScore();
  if (score > 5) {
    speed = 9;
  }
  if (score > 10) {
    speed = 11;
  }

  setTimeout(drawGame, 1000 / speed);
}

// game over
function isGameOver() {
  let gameOver = false;
  // 判斷準備開始的狀態
  if (yDirection === 0 && xDirection === 0) return false;

  // 撞到牆壁時，回傳 true
  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }

  // 判斷蛇撞到自己身體，回傳 true
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "bold 40px Lato";
    ctx.fillText("Game Over!", canvas.width / 4, canvas.height / 2);
    ctx.font = "20px Lato";
    ctx.fillText(`your score: ${score}`, canvas.width / 2.7, canvas.height / 1.7);
  }
  
  return gameOver;
}

// clear canvas
function clearScreen() {
  ctx.fillStyle = "#313131";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 繪製蛇
function drawSnake() {
  ctx.fillStyle = "green";
  // 繪製蛇的身體
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }
  // 先進先出概念
  // 每次更新畫面，頭部會移動到新的位置，而舊頭部被推到佇列中，成為身體一部分
  snakeParts.push(new SnakePart(headX, headY));
  if (snakeParts.length > tailLength) {
    // 此方法會刪除陣列第一個元素
    snakeParts.shift(); 
  }
  // 繪製蛇的頭部
  ctx.fillStyle = "orange";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

// 變換蛇的位置
function changeSnakePosition() {
  headX += xDirection;
  headY += yDirection;
}

// 繪製蘋果
function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

// 碰到蘋果時
// 1. 將蘋果位置設定成隨機位置
// 2. 增加貪吃蛇的長度
// 3. 分數累加、以及用 localStorage 紀錄最高分
function checkAppleCollision() {
  if (appleX === headX && appleY == headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;

    highest_score = (score > highest_score) ? score : highest_score;
    localStorage.setItem('highest', JSON.stringify(highest_score));
    gulpSound.play();
  }
}

// 方向鍵偵測
function keyDown(event) {
  // keyCode: 37: left, 38: up, 39: right, 40: down
  if (event.keyCode === 38 && yDirection !== 1) {
    yDirection = -1;
    xDirection = 0;
  }

  if (event.keyCode === 40 && yDirection !== -1) {
    yDirection = 1;
    xDirection = 0;
  }

  if (event.keyCode === 37 && xDirection !== 1) {
    yDirection = 0;
    xDirection = -1;
  }

  if (event.keyCode === 39 && xDirection !== -1) {
    yDirection = 0;
    xDirection = 1;
  }
}

// 更新分數
function updateScore() {
  score_el.innerText = score;
  highest_score_el.innerText = highest_score; 
}

// Event Listener
window.addEventListener("keydown", keyDown);
restart.addEventListener("click", () => window.location.reload());

drawGame();
