const { MongoClient } = require("mongodb");

const DB_NAME = "todo-app";

async function getDb() {
  const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
  await client.connect();
  const db = client.db(DB_NAME);
  return db;
}

async function getTodoCollection() {
  const db = await getDb();
  const todos = db.collection("todos").find().toArray();
  return todos;
}

module.exports = { getTodoCollection, getDb };
