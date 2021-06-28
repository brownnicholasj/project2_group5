/*
    Reads the user input for login data through an HTML form
    Performs the necessary validations
*/
const loginFormHandler = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  // If email and password are provided, post a call to the /api/users end point
  if (email && password) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    // If successful login, saves the session and redirects the user to the homepage
    if (response.ok) {
      document.location.replace('/');
    } else {
      alert('Failed to log in.');
    }
  }
};

/*
    Allows the user to see the entered password in the HTML form
*/
const showPassword = () => {
  var checkbox = document.getElementById('password-login');
  if (checkbox.type === 'password') {
    checkbox.type = 'text';
  } else {
    checkbox.type = 'password';
  }
};

/*
    Creates event listeners
*/
document
  .querySelector('#login-form')
  .addEventListener('submit', loginFormHandler);
