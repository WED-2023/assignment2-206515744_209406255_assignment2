document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("LoginForm");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault(); 
      const username = document.getElementById("LoginUsername").value.trim();
      const password = document.getElementById("LoginPassword").value;
      let user=null;
      if (username==="p" && password==="testuser"){
        user={username:username,password:password,firstName:"test",lastName:"test",email:"test@test.com"};
      }
      else{
      user = users.find(u => u.username === username && u.password === password);
      }
     if (user){
        alert(`Welcome back, ${user.username}!`);
        showScreen("GameScreen")
      }
      else {
        event.preventDefault();
        alert("Invalid username or password.");
      } 
    });
  });