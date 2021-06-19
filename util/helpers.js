module.exports = {
  // date format helper in MM/DD/YYYY HH:MM format
  format_date: (date) => {
    return `${new Date(date).getMonth() + 1}/${new Date(
      date
    ).getDate()}/${new Date(date).getFullYear()} ${new Date(
      date
    ).getHours()}:${new Date(date).getMinutes()}`;
  },
};
