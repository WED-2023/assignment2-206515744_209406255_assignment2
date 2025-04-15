// Global state
let canvas, ctx, bgImage, heroImage, enemyFirstRowImage;
let gameScore = 0,heroLife=3;
let heroLaserSound,heroHitSound,heroKilledSound;
let showConfig = true;
let gameInterval;



const lasers = [];
const enemies = [];
const enemyLasers = [];



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
  speed: 7,
  width: 0,
  height: 0,
};
const enemyRow = {
   count: 5,
   spacing: 120,
   direction: 1, // 1 for right, -1 for left
   speed: 3,
 };

const heroLaserConfig = {
   width: 7,
   height: 10,
   speed: 8,
 };
 const enemyLaserConfig = {
   width: 4,
   height: 10,
   speed: 5,
 };

 


window.addEventListener("load", setupGame);

// setupGame is called when the app first launches
function setupGame() {
  canvas = document.getElementById("theCanvas");
  ctx = canvas.getContext("2d");

  bgImage = new Image();
  heroImage = new Image();
  enemyFirstRowImage = new Image();
  heroLaserSound = new Audio("static/sounds/herolaser.mp3");
  heroHitSound = new Audio("static/sounds/herohit.mp3");
  heroKilledSound = new Audio("static/sounds/herokilled.mp3");

  let loadedCount = 0;
  [bgImage, heroImage,enemyFirstRowImage].forEach(img => {
    img.onload = () => {
      loadedCount++;
      if (loadedCount === 3) {
        hero.width = heroImage.width;
        hero.height = heroImage.height;
        hero.x = (canvas.width - hero.width) / 2;
        hero.y = canvas.height - hero.height - 20;
        initEnemies();
        draw();
      }
    };
  });

  bgImage.src = "static/images/background.png";
  heroImage.src = "static/images/hero.png";
  enemyFirstRowImage.src = "static/images/enemyfirstrow.png";

  canvas.addEventListener("click", handleClick);

  document.addEventListener("keydown", function (e) {
   const minX = canvas.width * 0.3;
   const maxX = canvas.width * 0.7 - hero.width;
    if (!showConfig) {
      if (e.code === config.moveRight) {
        hero.x = Math.min(maxX, hero.x + hero.speed);
      } else if (e.code === config.moveLeft) {
        hero.x = Math.max(minX, hero.x - hero.speed);
      } else if (e.code === config.shootKey) {
        shootLaser();
      }
    }
  });
}

//initialize the enemies array with the given parameters
function initEnemies() {
   enemies.length = 0;
   const y = 200;
   for (let i = 0; i < enemyRow.count; i++) {
     enemies.push({
       x: 50 + i * enemyRow.spacing,
       y: y,
       width: 70,
       height: 70,
     });
   }
 }
 //update enemies position and check if they need to reverse direction
 function updateEnemies() {
   let shouldReverse = false;
   enemies.forEach(enemy => {
     enemy.x += enemyRow.direction * enemyRow.speed;
     if (enemy.x + enemy.width >= canvas.width || enemy.x <= 0) {
       shouldReverse = true;
     }
     if (Math.random() < 0.005) {
       shootEnemyLaser(enemy);
     }
   });
   if (shouldReverse) enemyRow.direction *= -1;
 }
 

//add a new laser to the lasers array when the shoot key is pressed
function shootLaser() {
  heroLaserSound.play();
  const laser = {
    x: hero.x + hero.width / 2 - 2,
    y: hero.y,
    ...heroLaserConfig
  };
  lasers.push(laser);
}

function shootEnemyLaser(enemy) {
   const laser = {
     x: enemy.x + enemy.width / 2 - 2,
     y: enemy.y + enemy.height,
     ...enemyLaserConfig,
   };
   enemyLasers.push(laser);
 }

// Start a new game
function startGameLoop() {
  const intervalMs = 1000 / 60; // 60 FPS
  gameInterval = setInterval(() => {
    updateLaser();
    updateEnemies();
    updateEnemyLasers();
    config.gameTime -= intervalMs / 1000;
    draw();
  }, intervalMs);
}

// Stop the game loop
function stopGameLoop() {
  clearInterval(gameInterval);
}

// Update laser positions and remove off-screen lasers
function updateLaser() {
   for (let i = lasers.length - 1; i >= 0; i--) {
     const laser = lasers[i];
     laser.y -= laser.speed;
 
     // Remove if off screen
     if (laser.y + laser.height < 0) {
       lasers.splice(i, 1);
       continue;
     }
 
     // Check for collision with enemies
     for (let j = enemies.length - 1; j >= 0; j--) {
       const enemy = enemies[j];
       const hit = (
         laser.x < enemy.x + enemy.width &&
         laser.x + laser.width > enemy.x &&
         laser.y < enemy.y + enemy.height &&
         laser.y + laser.height > enemy.y
       );
 
       if (hit) {
         gameScore += 1; // Increase score
         lasers.splice(i, 1);
         enemies.splice(j, 1);
         break; // Break inner loop since this laser is gone
       }
     }
   }
 }

 //checks for collision between the enemy lasers and the hero
 function updateEnemyLasers() {
   for (let i = enemyLasers.length - 1; i >= 0; i--) {
     const laser = enemyLasers[i];
     laser.y += laser.speed;
     if (laser.y > canvas.height) {
       enemyLasers.splice(i, 1);
       continue;
     }
     if (
       laser.x < hero.x + hero.width &&
       laser.x + laser.width > hero.x &&
       laser.y < hero.y + hero.height &&
       laser.y + laser.height > hero.y
     ) {
       enemyLasers.splice(i, 1);
       heroLife -= 1; // Decrease hero life
       heroHitSound.play();
       if (heroLife <= 0) {
         heroKilledSound.play();
         stopGameLoop();
         alert("Game Over");
       }
     }
   }
 }

// Handle click events for the config menu
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
    document.addEventListener("keydown", function chooseKey(e) {
      config.shootKey = e.code;
      document.removeEventListener("keydown", chooseKey);
      draw();
    });
  }

  // Move Left Key
  if (isInBox(x, y, startX + 250, startY + 120, 100, 30)) {
    document.addEventListener("keydown", function chooseKey(e) {
      config.moveLeft = e.code;
      document.removeEventListener("keydown", chooseKey);
      draw();
    });
  }

  // Move Right Key
  if (isInBox(x, y, startX + 250, startY + 170, 100, 30)) {
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
  if (isInBox(x, y, startX + 265, startY + 220, 30, 30) && config.gameTime > 120) {
    config.gameTime--;
    draw();
  }
}

// Check if the click is within the bounds of a box
function isInBox(x, y, boxX, boxY, boxW, boxH) {
  return x >= boxX && x <= boxX + boxW && y >= boxY && y <= boxY + boxH;
}

//draw the config menu
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

  drawText(`Game Time (secs): ${config.gameTime}`, startX + 20, startY + 240);
  drawButton(startX + 265, startY + 220, 30, 30, "-", "red");
  drawButton(startX + 305, startY + 220, 30, 30, "+", "green");

  drawButton(startX + 20, startY + 270, 100, 30, "Start Game", "green");
}

//draw text with the given parameters
function drawText(text, x, y, font = "20px Arial", color = "white") {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

//draw the button with the given parameters
function drawButton(x, y, width, height, label, bgColor) {
  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(label, x + 8, y + height / 1.5);
}

//if config.showConfig is true, draw the config menu
//if config.showConfig is false, draw the game
function draw() {
  canvas.width = canvas.width; // Clear canvas
  ctx.drawImage(bgImage, 0, 0);
  if (showConfig) return drawConfigMenu();
  drawGame();
}

//drawing the main game loop
function drawGame() {
  ctx.drawImage(heroImage, hero.x, hero.y);
  lasers.forEach(laser => {
    ctx.fillStyle = "red";
    ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
  });
  enemies.forEach(enemy => {
   ctx.drawImage(enemyFirstRowImage, enemy.x, enemy.y, enemy.width, enemy.height);
 });
   enemyLasers.forEach(laser => {
      ctx.fillStyle = "yellow";
      ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
   });
  drawText(`Timer: ${Math.round(config.gameTime)}`, 10, 30, "24px Helvetica", "rgb(250, 250, 250)");
  drawText(`Lives: ${heroLife}`, 10, 50, "24px Helvetica", "rgb(250, 250, 250)");

  drawText(`Score: ${gameScore}`, canvas.width /2 - 60 , 40, "40px Helvetica", "rgb(250, 250, 250)");  
  
}
