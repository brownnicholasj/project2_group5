/*
    Reads the user input for signup data through an HTML form
    Performs the necessary validations
*/
const signupFormHandler = async (event) => {
  event.preventDefault();

  const username = document.querySelector('#user-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  // If username, email and password are provided, post a call to the /api/users end point
  if (username && email && password) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    // If successful login, saves the session and redirects the user to the homepage
    if (response.ok) {
      document.location.replace('/');
    } else {
      alert('Failed to sign up.');
    }
  }
};

/*
    Creates event listeners
*/
document
  .querySelector('#signup-form')
  .addEventListener('submit', signupFormHandler);
