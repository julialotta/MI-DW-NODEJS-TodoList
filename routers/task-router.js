const express = require("express");
const { ObjectId } = require("mongodb");
const utils = require("../utils.js");
const db = require("../database");
const router = express.Router();

const TODOS_COLLECTION = "todos";

//GET Homepage
router.get("/", async (req, res) => {
  const todos = await db.getTodoCollection();
  res.render("home", { todos });
});

//GET Uncompleted tasks
router.get("/uncompletedtasks", async (req, res) => {
  const todos = await db.getTodoCollection();
  let uncompleted = [];
  for (let i = 0; i < todos.length; i++) {
    if (!todos[i].done) uncompleted.push(todos[i]);
  }
  res.render("tasks/uncompleted-tasks", { uncompleted });
});

//GET Completed tasks
router.get("/completedtasks", async (req, res) => {
  const todos = await db.getTodoCollection();
  let completed = [];
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].done) completed.push(todos[i]);
  }
  res.render("tasks/completed-tasks", { completed });
});

//GET Assigned tasks. Tasks sorted in alphabetical user order.
router.get("/assigned", async (req, res) => {
  const todos = await db.getTodoCollection();
  let assigned = [];
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].assigned) assigned.push(todos[i]);
  }
  assigned.sort((a, b) => a.user.user.localeCompare(b.user.user));
  res.render("users/assigned", { assigned });
});

//GET Unassigned tasks
router.get("/unassigned", async (req, res) => {
  const todos = await db.getTodoCollection();
  let unassigned = [];
  for (let i = 0; i < todos.length; i++) {
    if (!todos[i].assigned) unassigned.push(todos[i]);
  }
  res.render("users/unassigned", { unassigned });
});

//GET Tasks sorted by descending time/date
router.get("/descending", async (req, res) => {
  const todos = await db.getTodoCollection();
  todos.sort((a, b) => (a.created > b.created ? 1 : -1));
  res.render("home", { todos });
});

//GET Tasks sorted by ascending time/date
router.get("/ascending", async (req, res) => {
  const todos = await db.getTodoCollection();
  todos.sort((a, b) => (a.created > b.created ? -1 : 1));
  res.render("home", { todos });
});

//POST New task
router.post("/newtask", async (req, res) => {
  const newTodo = {
    created: utils.getDate(),
    description: req.body.description,
    done: false,
    assigned: false,
  };

  if (utils.validateNewTodo(newTodo)) {
    const database = await db.getDb();
    await database.collection(TODOS_COLLECTION).insertOne(newTodo);
    res.redirect("/");
  } else {
    const todos = await db.getTodoCollection();
    res.render("home", {
      error: "Data error",
      todos,
    });
  }
});

//GET Single task
router.get("/task/:id", async (req, res) => {
  const id = ObjectId(req.params.id);
  const database = await db.getDb();
  database
    .collection(TODOS_COLLECTION)
    .findOne({ _id: id }, async (err, task) => {
      const users = await db.getUserCollection();
      res.render("tasks/single-task", { task, users });
    });
});

//GET Single task edit
router.get("/:id/edit", async (req, res) => {
  const id = ObjectId(req.params.id);
  const database = await db.getDb();
  database.collection(TODOS_COLLECTION).findOne({ _id: id }, (err, task) => {
    res.render("tasks/edit", task);
  });
});

//POST Single task edit
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
    await database
      .collection(TODOS_COLLECTION)
      .updateOne({ _id: id }, { $set: newTask });
    res.redirect("/");
  } else {
    res.sendStatus(400);
  }
});

//GET Single task delete
router.get("/:id/delete", async (req, res) => {
  const id = ObjectId(req.params.id);
  const database = await db.getDb();
  database.collection(TODOS_COLLECTION).findOne({ _id: id }, (err, task) => {
    res.render("tasks/delete", task);
  });
});

//POST Single task delete
router.post("/:id/delete", async (req, res) => {
  const id = ObjectId(req.params.id);
  const database = await db.getDb();
  database.collection(TODOS_COLLECTION).deleteOne({ _id: id }, (err, task) => {
    res.redirect("/");
  });
});

//POST Assign user to task
router.post("/:id/assign", async (req, res) => {
  const userId = ObjectId(req.body.user);
  const taskId = ObjectId(req.params.id);
  const database = await db.getDb();
  database.collection("users").findOne({ _id: userId }, async (err, user) => {
    const newTask = {
      assigned: true,
      user,
    };
    if (utils.validateAssignment(newTask)) {
      const database = await db.getDb();
      await database
        .collection(TODOS_COLLECTION)
        .updateOne({ _id: taskId }, { $set: newTask });
      res.redirect("/");
    } else {
      res.sendStatus(400);
    }
  });
});

module.exports = router;
