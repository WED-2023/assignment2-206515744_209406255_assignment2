// Global state
let canvas, ctx;
let bgImage, heroImage, enemyFirstRowImage, enemySecondRowImage, enemyThirdRowImage, enemyFourthRowImage;
let gameScore = 0;
let heroLaserSound, heroHitSound, heroKilledSound, enemyHit1, enemyHit2, enemyHit3;
let gameBGM;
let showConfig = true;
let gameInterval;
let timeFromGameStart = 0;
let gameOverMessage = null;
let gameEnded = false;

window.currentUser={username:"p",password:"testuser",firstName:"test",lastName:"test",email:"test@test.com"};


const lasers = [];
const enemies = [];
const enemyLasers = [];
const leaderboard = [];

let enemyRowSpeed,enemyLaserSpeed;

const config = {
  shootKey: "Space",
  moveLeft: "ArrowLeft",
  moveRight: "ArrowRight",
  gameTime: 2 * 60, // in seconds
  heroLives: 3,
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
  speed: 9,
  width: 0,
  height: 0,
};

const enemyRow = {
  count: 5,
  spacing: 120,
  direction: 1, // 1 for right, -1 for left
  speed: 2,
};

const heroLaserConfig = {
  width: 7,
  height: 10,
  speed: 5,
};

const enemyLaserConfig = {
  width: 7,
  height: 10,
  speed: 4,
};

window.addEventListener("load", setupGame);

function setupGame() {
  canvas = document.getElementById("theCanvas");
  ctx = canvas.getContext("2d");

  bgImage = new Image();
  heroImage = new Image();
  enemyFirstRowImage = new Image();
  enemySecondRowImage = new Image();
  enemyThirdRowImage = new Image();
  enemyFourthRowImage = new Image();

  heroLaserSound = new Audio("static/sounds/herolaser.mp3");
  heroHitSound = new Audio("static/sounds/herohit.mp3");
  heroKilledSound = new Audio("static/sounds/herokilled.mp3");
  enemyHit1 = new Audio("static/sounds/enemyhit1.mp3");
  enemyHit2 = new Audio("static/sounds/enemyhit2.mp3");
  enemyHit3 = new Audio("static/sounds/enemyhit3.mp3");
  gameBGM = new Audio("static/sounds/gamebgm.mp3");
  gameBGM.loop = true;
  gameBGM.volume = 0.1;

  let loadedCount = 0;
  [bgImage, heroImage, enemyFirstRowImage, enemySecondRowImage, enemyThirdRowImage, enemyFourthRowImage].forEach(img => {
    img.onload = () => {
      loadedCount++;
      if (loadedCount === 6) {
        const heroScale = 1.2;
        hero.width = heroImage.width * heroScale;
        hero.height = heroImage.height * heroScale;
        const minX = canvas.width * 0.3 + hero.width;
        const maxX = canvas.width * 0.7 - hero.width;
        hero.x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        hero.y = canvas.height - hero.height - 20;
        initEnemies();
        draw();
      }
    };
  });

  bgImage.src = "static/images/background.png";
  heroImage.src = "static/images/hero.png";
  enemyFirstRowImage.src = "static/images/enemyfirstrow.png";
  enemySecondRowImage.src = "static/images/enemysecondrow.png";
  enemyThirdRowImage.src = "static/images/enemythirdrow.png";
  enemyFourthRowImage.src = "static/images/enemyfourthrow.png";

  canvas.addEventListener("click", handleClick);

  // Game controls for hero actions while playing remain unchanged.
  document.addEventListener("keydown", function(e) {
    const minX = canvas.width * 0.3 + hero.width;
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

function initEnemies() {
  enemies.length = 0;
  enemyRowSpeed=enemyRow.speed;
  enemyLaserSpeed=enemyLaserConfig.speed;
  const rows = [400, 300, 200, 100]; // y positions for each row of enemies
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const y = rows[rowIndex];
    for (let i = 0; i < enemyRow.count; i++) {
      enemies.push({
        x: 50 + i * enemyRow.spacing,
        y: y,
        width: 80,
        height: 80,
        row: rowIndex + 1, // row number: 1 = first row, etc.
      });
    }
  }
}

function updateEnemies() {
  let shouldReverse = false;
  enemies.forEach(enemy => {
    enemy.x += enemyRow.direction * enemyRowSpeed;
    if (enemy.x + enemy.width >= canvas.width || enemy.x <= 0) {
      shouldReverse = true;
    }
  });
  if (shouldReverse) enemyRow.direction *= -1;
}

function tryEnemyShooting() {
  if (enemies.length === 0) return;


  // Only try shooting if no enemy laser exists or the last one has passed 75% of the canvas height
  if (enemyLasers.length === 0 || enemyLasers[enemyLasers.length - 1].y > canvas.height * 0.75) {
    // Filter enemies that are within the center 40% range
    const minX = canvas.width * 0.3 + hero.width;
    const maxX = canvas.width * 0.7 - hero.width;
    const eligibleEnemies = enemies.filter(enemy => {
    const enemyCenter = enemy.x + enemy.width / 2;
    return enemyCenter >= minX && enemyCenter <= maxX;
   });
    if (eligibleEnemies.length > 0) {
      const randomIndex = Math.floor(Math.random() * eligibleEnemies.length);
      const randomEnemy = eligibleEnemies[randomIndex];
      shootEnemyLaser(randomEnemy);
    }
  }
}

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

function startGameLoop() {
   gameBGM.play();
  const intervalMs = 1000 / 60; // 60 FPS
  gameInterval = setInterval(() => {
    updateLaser();
    updateEnemies();
    updateEnemyLasers();
    tryEnemyShooting();
    timeFromGameStart += intervalMs / 1000;
    if (Math.round(timeFromGameStart) === 5) {
      console.log("5 seconds passed");
      enemyRowSpeed += 0.02;
      enemyLaserSpeed += 0.02;
    } else if (Math.round(timeFromGameStart) === 10) {
      console.log("10 seconds passed");
      enemyRowSpeed += 0.02;
      enemyLaserSpeed += 0.02;
    } else if (Math.round(timeFromGameStart) === 15) {
      console.log("15 seconds passed");
      enemyRowSpeed += 0.02;
      enemyLaserSpeed += 0.02;
    } else if (Math.round(timeFromGameStart) === 20) {
      console.log("20 seconds passed");
      enemyRowSpeed += 0.02;
      enemyLaserSpeed += 0.02;
    }
    draw();
    if (config.gameTime - timeFromGameStart <= 0) {
      clearInterval(gameInterval); // Stop ticking
      if (enemies.length === 0) {
        stopGameLoop("Champion!");
      } else if (gameScore >= 100) {
        stopGameLoop("Winner!");
      } else {
        stopGameLoop("You can do better!");
      }
    } else if (enemies.length === 0) {
      stopGameLoop("Champion!");
    }
  }, intervalMs);
}

function stopGameLoop(message) {
   gameEnded = true;
  clearInterval(gameInterval);
  gameBGM.pause();
  gameBGM.currentTime = 0;
  gameOverMessage = message;

  leaderboard.push({
    name: `${window.currentUser.firstName} ${window.currentUser.lastName}`,
    score: gameScore
  });
  leaderboard.sort((a, b) => b.score - a.score);
  if (leaderboard.length > 5) leaderboard.length = 5;
   draw();  // Force one last draw with the message
 }
 
 function resetGame(wasEnded) {
   // 🚨 Prevent multiple intervals from overlapping
   clearInterval(gameInterval);
   // Reset state
   enemyRowSpeed = enemyRow.speed;
   enemyLaserSpeed = enemyLaserConfig.speed;

   lasers.length = 0;
   enemyLasers.length = 0;
   enemies.length = 0;
   gameScore = 0;
   config.heroLives = 3;
   timeFromGameStart = 0;
   gameEnded = false;
   gameOverMessage = null;
   enemyRowSpeed = enemyRow.speed;
   enemyLaserSpeed = enemyLaserConfig.speed;
 
   const heroScale = 1.2;
   hero.width = heroImage.width * heroScale;
   hero.height = heroImage.height * heroScale;
   const minX = canvas.width * 0.3 + hero.width;
   const maxX = canvas.width * 0.7 - hero.width;
   hero.x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
   hero.y = canvas.height - hero.height - 20;
 
   initEnemies();
   startGameLoop();
 }
 
 
function updateLaser() {
  for (let i = lasers.length - 1; i >= 0; i--) {
    const laser = lasers[i];
    laser.y -= laser.speed;
    if (laser.y + laser.height < 0) {
      lasers.splice(i, 1);
      continue;
    }
    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];
      if (
        laser.x < enemy.x + enemy.width &&
        laser.x + laser.width > enemy.x &&
        laser.y < enemy.y + enemy.height &&
        laser.y + laser.height > enemy.y
      ) {
        const num = Math.round(Math.random() * 2);
        switch (num) {
          case 0:
            enemyHit1.play();
            break;
          case 1:
            enemyHit2.play();
            break;
          case 2:
            enemyHit3.play();
            break;
        }
        gameScore += enemy.row * 5;
        lasers.splice(i, 1);
        enemies.splice(j, 1);
        break;
      }
    }
  }
}

function updateEnemyLasers() {
  for (let i = enemyLasers.length - 1; i >= 0; i--) {
    const laser = enemyLasers[i];
    laser.y += enemyLaserSpeed;
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
      heroHitSound.play();
      config.heroLives--;
      if (config.heroLives > 0) {
        const minX = canvas.width * 0.3 + hero.width;
        const maxX = canvas.width * 0.7 - hero.width;
        hero.x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
      }
      if (config.heroLives <= 0) {
         heroKilledSound.volume = 0.5;
         heroKilledSound.play();
         stopGameLoop("You Lost!");
       }
    }
  }
}

// A generic function that binds a new key to an action.
// It shows a prompt (drawMessage) and listens for the next keydown event.
function bindKey(actionName) {
  drawMessage(`Press a new key for ${actionName}`);
  window.addEventListener("keydown", function listener(e) {
    config[actionName] = e.code;
    draw();
  }, { once: true });
}

// Helper function to draw a temporary message on the canvas.
function drawMessage(message) {
   ctx.font = "50px Arial";
   ctx.textBaseline = "middle"; // Center text vertically
   const textWidth = ctx.measureText(message).width;
   const padding = 10;
   const x = (canvas.width - textWidth) / 2;
   const y = canvas.height / 2;
   
   // Draw a semi-transparent rectangle behind the text
   ctx.fillStyle = "rgba(0, 0, 0, 1)";
   // The top is shifted up by half the text height (15px) plus the padding.
   ctx.fillRect(x - padding, y - 15 - padding, textWidth + padding * 2, 30 + padding * 2);
   
   // Draw the yellow text over the rectangle
   ctx.fillStyle = "yellow";
   ctx.fillText(message, x, y);
 }

//handles click events on the config menu
function handleClick(event) {
   const rect = canvas.getBoundingClientRect();
   const x = event.clientX - rect.left;
   const y = event.clientY - rect.top;
 
   // ✅ Check Start New Game button first
   if (!showConfig && isInBox(x, y, canvas.width - 170, canvas.height - 60, 150, 40)) {
     resetGame(gameEnded); // pass whether it ended or not
     return;
   }
 
   // ⛔️ Now block config handling if config menu isn't showing
   if (!showConfig) return;
 
   const { startX, startY } = MENU;
 
   // Start Game button
   if (isInBox(x, y, startX + 20, startY + 270, 100, 30)) {
     showConfig = false;
     startGameLoop();
   }
 
   // Change Shoot Key
   if (isInBox(x, y, startX + 250, startY + 70, 100, 30)) {
     bindKey("shootKey");
   }
 
   // Change Move Left Key
   if (isInBox(x, y, startX + 250, startY + 120, 100, 30)) {
     bindKey("moveLeft");
   }
 
   // Change Move Right Key
   if (isInBox(x, y, startX + 250, startY + 170, 100, 30)) {
     bindKey("moveRight");
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
  drawText(`Game Time (secs): ${config.gameTime}`, startX + 20, startY + 240);
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
   if (showConfig) {
      drawConfigMenu();
    } else {
      drawGame();
    }
    
    if (gameOverMessage) {
      drawMessage(gameOverMessage);
      drawText("Leaderboard:", canvas.width - 220, 30, "20px Helvetica", "white");
      leaderboard.forEach((entry, i) => {
        drawText(`${i + 1}. ${entry.name}: ${entry.score}`, canvas.width - 220, 60 + i * 25, "18px Helvetica", "white");
      });
    }
 }
 

function drawGame() {
  ctx.drawImage(heroImage, hero.x, hero.y, hero.width, hero.height);
  lasers.forEach(laser => {
    ctx.fillStyle = "red";
    ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
  });
  enemyLasers.forEach(laser => {
    ctx.fillStyle = "yellow";
    ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
  });
  enemies.forEach(enemy => {
    switch (enemy.row) {
      case 4:
        ctx.drawImage(enemyFourthRowImage, enemy.x, enemy.y, enemy.width, enemy.height);
        break;
      case 3:
        ctx.drawImage(enemyThirdRowImage, enemy.x, enemy.y, enemy.width, enemy.height);
        break;
      case 2:
        ctx.drawImage(enemySecondRowImage, enemy.x, enemy.y, enemy.width, enemy.height);
        break;
      case 1:
        ctx.drawImage(enemyFirstRowImage, enemy.x, enemy.y, enemy.width, enemy.height);
        break;
    }
  });
  drawText(`Timer: ${Math.round(config.gameTime - timeFromGameStart)}`, 10, 30, "24px Helvetica", "rgb(250, 250, 250)");
  drawText(`Lives: ${config.heroLives}`, 10, 50, "24px Helvetica", "rgb(250, 250, 250)");
  drawText(`Score: ${gameScore}`, canvas.width / 2 - 70, 40, "40px Helvetica", "rgb(250, 250, 250)");
  drawButton(canvas.width - 170, canvas.height - 60, 150, 40, "Start New Game", "orange");

}
