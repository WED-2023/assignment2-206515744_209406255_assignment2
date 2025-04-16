// Wait for the DOM to be fully loaded before attaching event listeners
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signupForm");
    form.addEventListener("submit", function (event) {
      // Grab all input values and trim whitespace
      event.preventDefault(); 

      const username = document.getElementById("signupUsername").value.trim();
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById("signupValidatepassword").value;
      const firstName = document.getElementById("signupFirstname").value.trim();
      const lastName = document.getElementById("signupLastname").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
  
      // Validation patterns
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      const namePattern = /^[A-Za-z]+$/;
  
      
      let errorMessage = "";
  
      // Run validations
      if (!username || !password || !confirmPassword || !firstName || !lastName || !email) {
        errorMessage += "All fields are required.\n";
      } if (!passwordPattern.test(password)) {
        errorMessage += "Password must be at least 8 characters long and contain both letters and numbers.\n";
      } if (password !== confirmPassword) {
        errorMessage += "Passwords do not match.\n";
      } if (!namePattern.test(firstName)) {
        errorMessage += "First name should contain only letters.\n";
      }if (!namePattern.test(lastName)) {
        errorMessage += "Last name should contain only letters.\n";
      } if (!emailPattern.test(email)) {
        errorMessage += "Invalid email address.";
      }
  
      if(!errorMessage){
        users.push({
            username: username,
            password: password, // Store hashed in real apps!
            firstName: firstName,
            lastName: lastName,
            email: email
          });
        alert("Signup successful!"); // Replace with actual signup logic
      }
      else if (errorMessage){
        event.preventDefault(); 
        alert(errorMessage);    
      }
    });
  });
  