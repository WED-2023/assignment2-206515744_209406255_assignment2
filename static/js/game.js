let canvas; //canvas
let ctx; // context
let heroImage;


let showConfig = true;
let config = {
  shootKey: "Space",
  gameTime: 2,
};


window.addEventListener("load", setupGame, false);

function setupGame()
{
   //document.addEventListener( "unload", stopTimer, false );
   // get the canvas, its context and setup its click event handler
   canvas = document.getElementById( "theCanvas" );
   ctx = canvas.getContext("2d");
  
   bgImage = new Image();
   heroImage = new Image();

   let loadedCount = 0;
   const totalToLoad = 2;

   function checkAllLoaded() {
      loadedCount++;
      if (loadedCount === totalToLoad) {
        draw(); // Only draw when both images are ready
      }
    }
  
   bgImage.onload = checkAllLoaded;
   heroImage.onload = checkAllLoaded;

   bgImage.src = "static/images/background.png";
   heroImage.src= "static/images/hero.png";

   canvas.addEventListener("click", function (event) {
      if (!showConfig) return;
    
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
    
      // Handle "Start Game" button click
      if (x >= 120 && x <= 320 && y >= 300 && y <= 350) {
        showConfig = false;
        draw(); // redraw with game screen
      }
    
      // You could add toggle keys or gameTime selection here too
    });
  
   
} // end function setupGame

function drawConfigMenu() {
   ctx.fillStyle = "#000000aa"; // semi-transparent background
   ctx.fillRect(100, 100, 800, 600);
 
   ctx.fillStyle = "white";
   ctx.font = "28px Arial";
   ctx.fillText("Game Settings", 120, 150);
 
   ctx.font = "20px Arial";
   ctx.fillText("Shoot Key: " + config.shootKey, 120, 200);
   ctx.fillText("Game Time (min): " + config.gameTime, 120, 250);
 
   ctx.fillStyle = "green";
   ctx.fillRect(120, 300, 200, 50);
   ctx.fillStyle = "white";
   ctx.fillText("Start Game", 140, 335);
 }


function draw(){
   console.log("🖼️ Drawing game screen..."); // Add this

   canvas.width = canvas.width; // clears the canvas (from W3C docs)

   ctx.drawImage(bgImage, 0, 0);

  if (showConfig) {
    drawConfigMenu();
    return;
  }

  // Draw hero at a fixed position (e.g. center bottom)
  const heroX = (canvas.width - heroImage.width) / 2;
  const heroY = canvas.height - heroImage.height - 20;
  ctx.drawImage(heroImage, heroX, heroY);

  // Draw score
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Check", 10, 10);
}
/* 
configruation ->
   choose button for shoot
   choose game time with min of 2min
   we can add more options
   add start game button
   */