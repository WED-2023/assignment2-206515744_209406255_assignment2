let canvas; //canvas
let ctx; // context







function setupGame()
{

   // get the canvas, its context and setup its click event handler
   canvas = document.getElementById( "theCanvas" );
   ctx = canvas.getContext("2d");

   bgImage = new Image();
   bgImage.src = "static/images/background.png";
   draw();
   
} // end function setupGame
function draw(){
   ctx.drawImage(bgImage, 0, 0);
   // Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Check");
	
}
window.addEventListener("load", setupGame, false);