const getDb = require("../database.js");

const COLLECTION_NAME = "todos";

async function getList() {
  const db = await getDb();
  const dbTodos = db.collection(COLLECTION_NAME).find();

  const todos = [];

  await dbTodos.forEach((task) => {
    todos.push(task);
  });
  return todos;
}

module.exports = getList;
