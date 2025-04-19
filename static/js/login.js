document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("LoginForm");

  
    form.addEventListener("submit", function (event) {
      event.preventDefault(); 
      const username = document.getElementById("LoginUsername").value.trim();
      const password = document.getElementById("LoginPassword").value;
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        alert(`Welcome back, ${user.username}! you can now play the game`);
        window.currentUser = user;
        showScreen("WelcomeScreen");
        updateWelcomeScreen();  
      }
      else {
        event.preventDefault();
        alert("Invalid username or password.");
      } 
    });
  });