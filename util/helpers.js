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
};
