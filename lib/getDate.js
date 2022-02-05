function getDate() {
  const todaysDate = new Date();
  let newDate = todaysDate.toLocaleString().slice(0, -3);
  return newDate;
}

module.exports = getDate;
