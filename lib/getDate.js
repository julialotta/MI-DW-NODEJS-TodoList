function getDate() {
  const todaysDate = new Date();
  const newDate =
    todaysDate.getFullYear() +
    "-" +
    parseInt(todaysDate.getMonth() + 1) +
    "-" +
    todaysDate.getDate() +
    " " +
    todaysDate.getHours() +
    ":" +
    todaysDate.getMinutes();
  return newDate;
}

module.exports = getDate;
