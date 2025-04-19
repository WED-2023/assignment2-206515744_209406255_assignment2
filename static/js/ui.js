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

    document.getElementById("logout").addEventListener("click", () => {
      if (!window.currentUser) {
        alert("You are not logged in.");
        return;
      }
      window.currentUser = null;
      alert("Logged out successfully.");
      updateWelcomeScreen(); 
      showScreen("WelcomeScreen");
    });
    
    document.getElementById("playButton").addEventListener("click", () => {
      if (!window.currentUser) {
        alert("You must be logged in to play the game.");
        return;
      }
      showScreen("GameScreen");
      document.getElementById("theCanvas").focus();
    });
  });
  function updateWelcomeScreen() {
    const authButtons = document.getElementById("authButtons");
    const greeting = document.getElementById("greeting");
    const welcomeUser = document.getElementById("welcomeUser");
    const welcomeMessage = document.getElementById("welcomeMessage");
  
    if (window.currentUser) {
      authButtons.style.display = "none";
      greeting.style.display = "block";
      welcomeUser.textContent = `Hello ${window.currentUser.firstName} ${window.currentUser.lastName}! You can now play the game`;
      if (welcomeMessage) welcomeMessage.style.display = "none"; 
    } else {
      authButtons.style.display = "block";
      greeting.style.display = "none";
      welcomeUser.textContent = "";
      if (welcomeMessage) welcomeMessage.style.display = "block"; 
    }
  }