function getDate() {
  const todaysDate = new Date();
  let newDate = todaysDate.toLocaleString().slice(0, -3);
  return newDate;
}

function validateNewTodo(todo) {
  let valid = true;
  valid = valid && todo.description.length > 0;
  valid = valid && todo.created;
  return valid;
}

function validateNewUser(user) {
  let valid = true;
  valid = valid && user.user.length > 0;
  return valid;
}

function validateUpdatedTodo(todo) {
  let valid = true;
  valid = valid && todo.description.length > 0;
  valid = valid && todo.created;
  return valid;
}
function validateUpdatedUser(user) {
  let valid = true;
  valid = valid && user.user.length > 0;
  return valid;
}

function validateAssignment(task) {
  let valid = true;
  valid = valid && task.assigned == true;
  valid = valid && task.user;
  return valid;
}

module.exports = {
  getDate,
  validateNewTodo,
  validateNewUser,
  validateUpdatedTodo,
  validateUpdatedUser,
  validateAssignment,
};
