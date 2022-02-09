const express = require("express");
const router = express.Router();
const getDb = require("../database.js");
const getDate = require("../lib/getDate.js");
const getList = require("../lib/getTodolist.js");
const { ObjectId } = require("mongodb");

const COLLECTION_NAME = "todos";

router.get("/", async (req, res) => {
  const todos = await getList();
  res.render("home", { todos });
});

router.get("/task/:id", async (req, res) => {
  const id = ObjectId(req.params.id);
  const db = await getDb();
  db.collection(COLLECTION_NAME).findOne({ _id: id }, (err, task) => {
    res.render("single-task", task);
  });
});

router.get("/uncompletedtasks", async (req, res) => {
  const todos = await getList();
  res.render("uncompleted-tasks", { todos });
});

router.get("/completedtasks", async (req, res) => {
  const todos = await getList();
  res.render("completed-tasks", { todos });
});
router.get("/descending", async (req, res) => {
  const todos = await getList();
  todos.sort((a, b) => (a.created > b.created ? 1 : -1));
  res.render("home", { todos });
});

router.get("/ascending", async (req, res) => {
  const todos = await getList();
  todos.sort((a, b) => (a.created > b.created ? -1 : 1));
  res.render("home", { todos });
});

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

router.get("/:id/edit", async (req, res) => {
  const id = ObjectId(req.params.id);
  const db = await getDb();
  db.collection(COLLECTION_NAME).findOne({ _id: id }, (err, task) => {
    res.render("edit", task);
  });
});

router.post("/:id/edit", async (req, res) => {
  const id = ObjectId(req.params.id);

  if (req.body.description && req.body.created) {
    const newTask = {
      description: req.body.description,
      created: req.body.created.replace("T", " "),
      done: req.body.done,
    };
    const db = await getDb();
    db.collection(COLLECTION_NAME).updateOne({ _id: id }, { $set: newTask });
    res.redirect("/");
  }
});

router.get("/:id/delete", async (req, res) => {
  const id = ObjectId(req.params.id);
  const db = await getDb();
  db.collection(COLLECTION_NAME).findOne({ _id: id }, (err, task) => {
    res.render("delete", task);
  });
});

router.post("/:id/delete", async (req, res) => {
  const id = ObjectId(req.params.id);
  const db = await getDb();
  db.collection(COLLECTION_NAME).deleteOne({ _id: id }, (err, task) => {
    res.redirect("/");
  });
});

module.exports = router;
