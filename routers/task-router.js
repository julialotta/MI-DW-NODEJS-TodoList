const express = require("express");
const router = express.Router();
const getDb = require("../database.js");
const getDate = require("../lib/getDate.js");
const { ObjectId } = require("mongodb");

const COLLECTION_NAME = "todos";

router.get("/", async (req, res) => {
  const db = await getDb();
  const dbTodos = db.collection(COLLECTION_NAME).find();

  const todos = [];

  await dbTodos.forEach((task) => {
    todos.push(task);
  });
  res.render("home", { todos });
});

router.get("/:id", async (req, res) => {
  const id = ObjectId(req.params.id);
  const db = await getDb();
  db.collection(COLLECTION_NAME).findOne({ _id: id }, (err, task) => {
    res.render("single-task", { task });
  });
});

/* 
router.get("/uncompletedtasks", (req, res) => {
  res.render("uncompleted-tasks", { todos });
});

router.get("/completedtasks", (req, res) => {
  res.render("completed-tasks", { todos });
});

router.get("/descending", (req, res) => {
  todos.sort((a, b) => (a.created > b.created ? 1 : -1));
  res.render("home", { todos });
});

router.get("/ascending", (req, res) => {
  todos.sort((a, b) => (a.created > b.created ? -1 : 1));
  res.render("home", { todos });
}); */

router.post("/newtask", async (req, res) => {
  const date = getDate();
  if (req.body.description) {
    const newTodo = {
      created: date,
      description: req.body.description,
      done: false,
    };
    const db = await getDb();
    await db.collection(COLLECTION_NAME).insertOne(newTodo);
    res.redirect("/");
  } else {
    res.sendStatus(400);
  }
});

router.get("/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.find((i) => i.id === id);
  res.render("edit", index);
});

router.post("/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((i) => i.id === id);
  todos[index].created = req.body.created.replace("T", " ");
  todos[index].description = req.body.description;
  if (req.body.done) {
    todos[index].done = true;
  } else {
    todos[index].done = false;
  }
  res.redirect("/" + id);
});

router.get("/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.find((i) => i.id === id);
  res.render("delete", index);
});

router.post("/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((i) => i.id === id);
  todos.splice(index, 1);
  res.redirect("/");
});

module.exports = router;
