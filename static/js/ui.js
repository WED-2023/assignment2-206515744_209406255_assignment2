// UI controls: screen switching & notifications

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

// Notification helper
function showNotification(msg, duration = 3000) {
  const box = document.getElementById('notification');
  box.textContent = msg;
  box.style.display = 'block';
  box.classList.add('show');
  setTimeout(() => {
    box.classList.remove('show');
    box.style.display = 'none';
  }, duration);
}

// Setup logic after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Start on the welcome screen
  showScreen('WelcomeScreen');

  // Button listeners
  document.getElementById('loginButton').addEventListener('click', () => showScreen('LoginScreen'));
  document.getElementById('signupButton').addEventListener('click', () => showScreen('SignupScreen'));
 document.getElementById('homeButton').addEventListener('click', () => {
  if (!showConfig) {
    resetGameState();
  }
    showScreen('WelcomeScreen');
  });

  document.getElementById('playButton').addEventListener('click', () => {
    if (!window.currentUser) {
      showNotification('You must be logged in to play the game.');
      return;
    }
    showScreen('GameScreen');
    document.getElementById('theCanvas').focus();
  });
  document.getElementById('logout').addEventListener('click', () => {
    if (!window.currentUser) {
      showNotification('You are not logged in.');
      return;
    }
    // If logging out mid-game, fully reset game state
    if (!showConfig) {
      resetGameState();
    }
    window.currentUser = null;
    showNotification('Logged out successfully.');
    updateWelcomeScreen();
    showScreen('WelcomeScreen');
  });
});

function updateWelcomeScreen() {
  const authButtons = document.getElementById('authButtons');
  const greeting     = document.getElementById('greeting');
  const welcomeUser  = document.getElementById('welcomeUser');
  const welcomeMsg   = document.getElementById('welcomeMessage');
  
  if (window.currentUser) {
    authButtons.style.display  = 'none';
    greeting.style.display     = 'block';
    welcomeUser.textContent    = `Hello ${window.currentUser.firstName} ${window.currentUser.lastName}! You can now play the game`;
    if (welcomeMsg) welcomeMsg.style.display = 'none';
  } else {
    authButtons.style.display  = 'block';
    greeting.style.display     = 'none';
    welcomeUser.textContent    = '';
    if (welcomeMsg) welcomeMsg.style.display = 'block';
  }
}
