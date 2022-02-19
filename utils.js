/* const getDb = require("./database.js");

const COLLECTION_NAME = "todos";

async function getList() {
  const db = await getDb();
  const dbTodos = db.collection(COLLECTION_NAME).find();

  const todos = [];

  await dbTodos.forEach((task) => {
    todos.push(task);
  });
  return todos;
} */

function getDate() {
  const todaysDate = new Date();
  let newDate = todaysDate.toLocaleString().slice(0, -3);
  return newDate;
}

function validateNewTodo(todo) {
  let valid = true;
  valid = valid && todo.description.length > 0;
  valid = valid && todo.created;
  valid = valid && todo.done;
  return valid;
}

function validateUpdatedTodo(todo) {
  let valid = true;
  valid = valid && todo.description.length > 0;
  valid = valid && todo.created;
  return valid;
}

module.exports = { getDate, validateNewTodo, validateUpdatedTodo };
