  function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(div => {
      div.style.display = 'none';
    });
  }

  function showScreen(screenId) {
    hideAllScreens();
    const screen = document.getElementById(screenId);
    if (screen) {
      screen.style.display = 'block';
    }
  }

  // Setup logic after DOM is ready
  document.addEventListener("DOMContentLoaded", function () {
    // Start on the welcome screen

    // Button listeners
    document.getElementById("loginButton").addEventListener("click", () => {
      showScreen("LoginScreen");
    });

    document.getElementById("signupButton").addEventListener("click", () => {
      showScreen("SignupScreen");
    });
    
    showScreen("WelcomeScreen"); //for now, need to style the game
    //showScreen("GameScreen"); //for now, need to style the game


  });
