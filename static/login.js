document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("LoginForm");
  
    form.addEventListener("submit", function (event) {
      const username = document.getElementById("LoginUsername").value.trim();
      const password = document.getElementById("LoginPassword").value;
  
      const user = users.find(u => u.username === username && u.password === password);
  
      if (!user) {
        event.preventDefault();
        alert("Invalid username or password.");
      } else {
        alert(`Welcome back, ${user.firstName}!`);

        // SWITCH TO GAME SCREEN
      }
    });
  });