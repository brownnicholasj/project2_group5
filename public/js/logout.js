const logoutHandler = async (event) => {
  event.preventDefault();

  const response = await fetch('/api/users/logout', {
    method: 'POST',
    body: JSON.stringify(),
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/');
  } else {
    alert('Failed to logout.');
  }
};

if (document.querySelector('#logout')) {
  document.querySelector('#logout').addEventListener('click', logoutHandler);
}

// Handles Go Back action
const goBack = async (event) => {
  event.preventDefault();

  document.history.back();
};

