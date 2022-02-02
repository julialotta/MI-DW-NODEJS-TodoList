function getDate() {
  const todaysDate = new Date();

  let month = parseInt(todaysDate.getMonth() + 1);
  if (month <= 9) {
    month = "0" + month;
  }
  let day = todaysDate.getDate();
  if (day <= 9) {
    day = "0" + day;
  }

  let newDate =
    todaysDate.getFullYear() +
    "-" +
    month +
    "-" +
    day +
    " " +
    todaysDate.getHours() +
    ":" +
    todaysDate.getMinutes();

  return newDate;
}

module.exports = getDate;
