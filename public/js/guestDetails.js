const guestFormHandler = async (event) => {
  event.preventDefault();

  const user_id = document
    .querySelector('#guest-type')
    .getAttribute('data-user_id')
    .trim();
  const guest_id = document
    .querySelector('#guest-type')
    .getAttribute('data-id')
    .trim();
  const event_id = document
    .querySelector('#guest-type')
    .getAttribute('data-event_id')
    .trim();
  const guest_type = document.querySelector('#guest-type').value.trim();
  const first_name = document.querySelector('#guest-first-name').value.trim();
  const last_name = document.querySelector('#guest-last-name').value.trim();
  const guest_addr1 = document.querySelector('#guest-addr1').value.trim();
  const guest_addr2 = document.querySelector('#guest-addr2').value.trim();
  const guest_city = document.querySelector('#guest-city').value.trim();
  const guest_state = document.querySelector('#guest-state').value.trim();
  const guest_zip = document.querySelector('#guest-zip').value.trim();
  const guest_country = document.querySelector('#guest-ctry').value.trim();
  const email = document.querySelector('#guest-email').value.trim();
  const phone = document.querySelector('#guest-phone').value.trim();
  const inviter = document.querySelector('#guest-inviter').value.trim();
  let response = document.querySelector('#guest-response').value.trim();

  if (response === 'none') {
    response = null;
  } else if (response === 'true') {
    response = true;
  } else {
    response = false;
  }

  if (guest_id && guest_type) {
    const send = await fetch(`/api/guests/${guest_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        guest_type,
        first_name,
        last_name,
        guest_addr1,
        guest_addr2,
        guest_city,
        guest_state,
        guest_zip,
        guest_country,
        email,
        phone,
        inviter,
        response,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (send.ok) {
      document.location.replace(`/users/${user_id}/events/${event_id}`);
    } else {
      alert('Failed to update.');
    }
  }
};

const guestDeleteHandler = async (event) => {
  event.preventDefault();
  const user_id = document
    .querySelector('#guest-type')
    .getAttribute('data-user_id')
    .trim();
  const guest_id = document
    .querySelector('#guest-type')
    .getAttribute('data-id')
    .trim();
  const send = await fetch(`/api/guests/${guest_id}`, {
    method: 'DELETE',
    body: JSON.stringify({
      guest_id,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (send.ok) {
    document.location.replace(`/users/${user_id}/events/${event_id}`);
  } else {
    alert('Failed to delete.');
  }
};

document
  .querySelector('#guest-update-btn')
  .addEventListener('click', guestFormHandler);

document
  .querySelector('#guest-delete-btn')
  .addEventListener('click', guestDeleteHandler);
