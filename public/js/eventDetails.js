const eventFormHandler = async (event) => {
  event.preventDefault();

  const user_id = document
    .querySelector('#event-name')
    .getAttribute('data-user_id')
    .trim();
  const event_id = document
    .querySelector('#event-name')
    .getAttribute('data-id')
    .trim();
  const name = document.querySelector('#event-name').value.trim();
  const event_type = document.querySelector('#event-type').value.trim();
  const event_date = document.querySelector('#event-date').value.trim();
  const location_name = document.querySelector('#event-loc-name').value.trim();
  const location_addr1 = document
    .querySelector('#event-loc-addr1')
    .value.trim();
  const location_addr2 = document
    .querySelector('#event-loc-addr2')
    .value.trim();
  const location_city = document.querySelector('#event-loc-city').value.trim();
  const location_state = document
    .querySelector('#event-loc-state')
    .value.trim();
  const location_zip = document.querySelector('#event-loc-zip').value.trim();
  const location_ctry = document.querySelector('#event-loc-ctry').value.trim();
  const event_reference = document.querySelector('#event-ref').value.trim();

  if (createBtn === 'create') {
    const response = await fetch(`/api/events`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        event_type,
        event_date,
        location_name,
        location_addr1,
        location_addr2,
        location_city,
        location_state,
        location_zip,
        location_ctry,
        event_reference,
        user_id,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace(`/dashboard`);
    } else {
      alert('Failed to update.');
    }
  } else if (event_date && event_id && location_name && name) {
    const response = await fetch(`/api/events/${event_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name,
        event_type,
        event_date,
        location_name,
        location_addr1,
        location_addr2,
        location_city,
        location_state,
        location_zip,
        location_ctry,
        event_reference,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace(`/users/${user_id}/events/${event_id}`);
    } else {
      alert('Failed to update.');
    }
  }
};

const eventDeleteHandler = async (event) => {
  event.preventDefault();
  const event_id = document
    .querySelector('#event-name')
    .getAttribute('data-id')
    .trim();
  const response = await fetch(`/api/events/${event_id}`, {
    method: 'DELETE',
    body: JSON.stringify({
      event_id,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace(`/dashboard`);
  } else {
    alert('Failed to delete.');
  }
};

const eventCancelHandler = async (event) => {
  event.preventDefault();

  window.history.back();
};

document
  .querySelector('#event-update-btn')
  .addEventListener('click', eventFormHandler);

document
  .querySelector('#event-delete-btn')
  .addEventListener('click', eventDeleteHandler);

document
  .querySelector('#event-cancel-btn')
  .addEventListener('click', eventCancelHandler);

document
  .querySelector('#event-create-btn')
  .addEventListener('click', eventFormHandler);

const createBtn = document
  .querySelector('#event-create-btn')
  .getAttribute('value');
