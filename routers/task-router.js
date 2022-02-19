const express = require("express");
const { ObjectId } = require("mongodb");
const utils = require("../utils.js");
const db = require("../database");
const router = express.Router();

const TODOS_COLLECTION = "todos";

router.get("/", async (req, res) => {
  const todos = await db.getTodoCollection();
  res.render("home", { todos });
});

router.get("/uncompletedtasks", async (req, res) => {
  const todos = await db.getTodoCollection();
  res.render("uncompleted-tasks", { todos });
});

router.get("/completedtasks", async (req, res) => {
  const todos = await db.getTodoCollection();
  res.render("completed-tasks", { todos });
});

router.get("/descending", async (req, res) => {
  const todos = await db.getTodoCollection();
  todos.sort((a, b) => (a.created > b.created ? 1 : -1));
  res.render("home", { todos });
});

router.get("/ascending", async (req, res) => {
  const todos = await db.getTodoCollection();
  todos.sort((a, b) => (a.created > b.created ? -1 : 1));
  res.render("home", { todos });
});

router.get("/task/:id", async (req, res) => {
  const id = ObjectId(req.params.id);
  const database = await db.getDb();
  database.collection(TODOS_COLLECTION).findOne({ _id: id }, (err, task) => {
    res.render("single-task", task);
  });
});

router.post("/newtask", async (req, res) => {
  const newTodo = {
    created: utils.getDate(),
    description: req.body.description,
    done: false,
  };

  if (utils.validateNewTodo) {
    const database = await db.getDb();
    await database.collection(TODOS_COLLECTION).insertOne(newTodo);
    res.redirect("/");
  } else {
    res.sendStatus(400);
  }
});

router.get("/:id/edit", async (req, res) => {
  const id = ObjectId(req.params.id);
  const database = await db.getDb();
  database.collection(TODOS_COLLECTION).findOne({ _id: id }, (err, task) => {
    res.render("edit", task);
  });
});

router.post("/:id/edit", async (req, res) => {
  const id = ObjectId(req.params.id);
  let doneStatus;
  if (req.body.done) {
    doneStatus = true;
  }
  if (!req.body.done) {
    doneStatus = false;
  }
  const newTask = {
    description: req.body.description,
    created: req.body.created.replace("T", " "),
    done: doneStatus,
  };
  if (utils.validateUpdatedTodo(newTask)) {
    const database = await db.getDb();
    database
      .collection(TODOS_COLLECTION)
      .updateOne({ _id: id }, { $set: newTask });
    res.redirect("/");
  } else {
    res.sendStatus(400);
  }
});

router.get("/:id/delete", async (req, res) => {
  const id = ObjectId(req.params.id);
  const database = await db.getDb();
  database.collection(TODOS_COLLECTION).findOne({ _id: id }, (err, task) => {
    res.render("delete", task);
  });
});

router.post("/:id/delete", async (req, res) => {
  const id = ObjectId(req.params.id);
  const database = await db.getDb();
  database.collection(TODOS_COLLECTION).deleteOne({ _id: id }, (err, task) => {
    res.redirect("/");
  });
});

module.exports = router;
