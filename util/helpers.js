const fetch = require('node-fetch');

module.exports = {
  // date format helper in MM/DD/YYYY HH:MM format
  format_date: (date) => {
    var hours = date.getHours();
    var min = date.getMinutes();

    min = min < 10 ? '0' + min : min;

    return `${new Date(date).getMonth() + 1}/${new Date(
      date
    ).getDate()}/${new Date(date).getFullYear()} ${hours}:${min}`;
  },

  days_left: (date) => {
    var eventDate = date.getTime();
    var currentDate = new Date().getTime();

    var difference = eventDate - currentDate;

    var days = Math.floor(difference / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    return `${days}d ${hours}h`;
  },

  isPrimary: (guest_type) => {
    return guest_type === 'Primary';
  },

  isError: (type) => {
    return type === 'Error';
  },

  isSuccess: (type) => {
    return type !== 'Error';
  },
};
