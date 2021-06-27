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
  const phone =
    document.querySelector('#guest-phone').value.length > 0
      ? document.querySelector('#guest-phone').value.trim()
      : null;
  const inviter = document.querySelector('#guest-inviter').value.trim();
  let response = document.querySelector('#guest-response').value.trim();

  if (response === 'none') {
    response = null;
  } else if (response === 'true') {
    response = true;
  } else {
    response = false;
  }

  if (createBtn === 'create') {
    if (guest_type) {
      const send = await fetch(`/api/guests`, {
        method: 'POST',
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
          event_id,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (send.ok) {
        document.location.replace(
          `/users/${user_id}/events/${event_id}/guestDetails`
        );
      } else {
        alert('Failed to create.');
      }
    }
  } else if (guest_id && guest_type) {
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

  const item_select = [...document.querySelectorAll('[id=items]')];

  for (let i = 0; i < item_select.length; i++) {
    if (item_select[i].checked) {
      var selected = true;
    } else {
      var selected = false;
    }
    var item_id = item_select[i].getAttribute('name');

    const isCreated = await fetch(
      `/guestitem/${event_id}/${guest_id}/${item_id}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (isCreated.ok) {
      var result = await isCreated.text();
    }

    console.log(result);
    if (result === 'FOUND') {
      const send = await fetch(`/api/guestitems`, {
        method: 'PUT',
        body: JSON.stringify({
          event_id,
          selected,
          guest_id,
          item_id,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (send.ok) {
        document.location.replace(`/users/${user_id}/events/${event_id}`);
      } else {
        alert('Failed to update.');
      }
    } else {
      const send = await fetch(`/api/guestitems`, {
        method: 'POST',
        body: JSON.stringify({
          event_id,
          selected,
          guest_id,
          item_id,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (send.ok) {
        document.location.replace(`/users/${user_id}/events/${event_id}`);
      } else {
        alert('Failed to update.');
      }
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
  const event_id = document
    .querySelector('#guest-type')
    .getAttribute('data-event_id')
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

const guestCancelHandler = async (event) => {
  event.preventDefault();

  window.history.back();
};

const createBtn = document
  .querySelector('#guest-create-btn')
  .getAttribute('value');

document
  .querySelector('#guest-update-btn')
  .addEventListener('click', guestFormHandler);

document
  .querySelector('#guest-delete-btn')
  .addEventListener('click', guestDeleteHandler);

document
  .querySelector('#guest-cancel-btn')
  .addEventListener('click', guestCancelHandler);

document
  .querySelector('#guest-create-btn')
  .addEventListener('click', guestFormHandler);
