// Global state
let canvas, ctx, bgImage, heroImage;
let showConfig = true;
let gameInterval;
let gameRunTime = 0;

const config = {
  shootKey: "Space",
  moveLeft: "ArrowLeft",
  moveRight: "ArrowRight",
  gameTime: 2*60, // in seconds
};

const MENU = {
  width: 500,
  height: 400,
  get startX() { return (canvas.width - this.width) / 2; },
  get startY() { return (canvas.height - this.height) / 2; },
};

const hero = {
  x: 0,
  y: 0,
  speed: 5,
  width: 0,
  height: 0,
};

const lasers = [];

window.addEventListener("load", setupGame);

function setupGame() {
  canvas = document.getElementById("theCanvas");
  ctx = canvas.getContext("2d");

  bgImage = new Image();
  heroImage = new Image();

  let loadedCount = 0;
  [bgImage, heroImage].forEach(img => {
    img.onload = () => {
      loadedCount++;
      if (loadedCount === 2) {
        hero.width = heroImage.width;
        hero.height = heroImage.height;
        hero.x = (canvas.width - hero.width) / 2;
        hero.y = canvas.height - hero.height - 20;
        draw();
      }
    };
  });

  bgImage.src = "static/images/background.png";
  heroImage.src = "static/images/hero.png";

  canvas.addEventListener("click", handleClick);

  document.addEventListener("keydown", function (e) {
    if (!showConfig) {
      if (e.code === config.moveRight) {
        hero.x = Math.min(canvas.width - hero.width, hero.x + hero.speed);
      } else if (e.code === config.moveLeft) {
        hero.x = Math.max(0, hero.x - hero.speed);
      } else if (e.code === config.shootKey) {
        shootLaser();
      }
    }
  });
}

function shootLaser() {
  const laser = {
    x: hero.x + hero.width / 2 - 2,
    y: hero.y,
    width: 4,
    height: 10,
    speed: 8,
  };
  lasers.push(laser);
}

function startGameLoop() {
  const intervalMs = 1000 / 60; // 30 FPS
  gameInterval = setInterval(() => {
    updateLaser();
    config.gameTime -= intervalMs / 1000;
    draw();
  }, intervalMs);
}

function stopGameLoop() {
  clearInterval(gameInterval);
}

function updateLaser() {
  // Update laser positions
  for (let i = lasers.length - 1; i >= 0; i--) {
    lasers[i].y -= lasers[i].speed;
    if (lasers[i].y + lasers[i].height < 0) {
      lasers.splice(i, 1);
    }
  }
}

function handleClick(event) {
  if (!showConfig) return;

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const { startX, startY } = MENU;

  // Start Game
  if (isInBox(x, y, startX + 20, startY + 270, 100, 30)) {
    showConfig = false;
    startGameLoop();
  }

  // Shoot Key
  if (isInBox(x, y, startX + 250, startY + 70, 100, 30)) {
    alert("Press the key you want to use to shoot");
    document.addEventListener("keydown", function chooseKey(e) {
      config.shootKey = e.code;
      document.removeEventListener("keydown", chooseKey);
      draw();
    });
  }

  // Move Left Key
  if (isInBox(x, y, startX + 250, startY + 120, 100, 30)) {
    alert("Press the key you want to use to move left");
    document.addEventListener("keydown", function chooseKey(e) {
      config.moveLeft = e.code;
      document.removeEventListener("keydown", chooseKey);
      draw();
    });
  }

  // Move Right Key
  if (isInBox(x, y, startX + 250, startY + 170, 100, 30)) {
    alert("Press the key you want to use to move right");
    document.addEventListener("keydown", function chooseKey(e) {
      config.moveRight = e.code;
      document.removeEventListener("keydown", chooseKey);
      draw();
    });
  }

  // Increase game time
  if (isInBox(x, y, startX + 305, startY + 220, 30, 30)) {
    config.gameTime++;
    draw();
  }

  // Decrease game time
  if (isInBox(x, y, startX + 265, startY + 220, 30, 30) && config.gameTime > 2) {
    config.gameTime--;
    draw();
  }
}

function isInBox(x, y, boxX, boxY, boxW, boxH) {
  return x >= boxX && x <= boxX + boxW && y >= boxY && y <= boxY + boxH;
}

function drawConfigMenu() {
  const { startX, startY, width, height } = MENU;
  ctx.fillStyle = "#000000aa";
  ctx.fillRect(startX, startY, width, height);

  drawText("Game Settings", startX + 10, startY + 40, "28px Arial", "white");

  drawText(`Shoot Key: ${config.shootKey}`, startX + 20, startY + 90);
  drawButton(startX + 250, startY + 70, 100, 30, "Change Key", "blue");

  drawText(`Move Left: ${config.moveLeft}`, startX + 20, startY + 140);
  drawButton(startX + 250, startY + 120, 100, 30, "Change Key", "blue");

  drawText(`Move Right: ${config.moveRight}`, startX + 20, startY + 190);
  drawButton(startX + 250, startY + 170, 100, 30, "Change Key", "blue");

  drawText(`Game Time (min): ${config.gameTime}`, startX + 20, startY + 240);
  drawButton(startX + 265, startY + 220, 30, 30, "-", "red");
  drawButton(startX + 305, startY + 220, 30, 30, "+", "green");

  drawButton(startX + 20, startY + 270, 100, 30, "Start Game", "green");
}

function drawText(text, x, y, font = "20px Arial", color = "white") {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function drawButton(x, y, width, height, label, bgColor) {
  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(label, x + 8, y + height / 1.5);
}

function draw() {
  canvas.width = canvas.width; // Clear canvas
  ctx.drawImage(bgImage, 0, 0);
  if (showConfig) return drawConfigMenu();
  drawGame();
}

function drawGame() {
  ctx.drawImage(heroImage, hero.x, hero.y);
  lasers.forEach(laser => {
    ctx.fillStyle = "red";
    ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
  });
  drawText(`Timer: ${Math.round(config.gameTime)}`, 10, 30, "24px Helvetica", "rgb(250, 250, 250)");  
}
