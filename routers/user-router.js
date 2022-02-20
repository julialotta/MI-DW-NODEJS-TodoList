const express = require("express");
const { ObjectId } = require("mongodb");
const utils = require("../utils.js");
const db = require("../database");
const router = express.Router();

const USER_COLLECTION = "users";
const TODOS_COLLECTION = "todos";

//GET /all users
router.get("/users", async (req, res) => {
  const users = await db.getUserCollection();
  res.render("users/users", { users });
});

// POST new user
router.post("/newuser", async (req, res) => {
  const newUser = {
    user: req.body.user,
  };

  if (utils.validateNewUser(newUser)) {
    const database = await db.getDb();
    await database.collection(USER_COLLECTION).insertOne(newUser);
    res.redirect("/user/users");
  } else {
    res.sendStatus(400);
  }
});

// GET single user
router.get("/:id", async (req, res) => {
  const id = ObjectId(req.params.id);
  const database = await db.getDb();
  database
    .collection(USER_COLLECTION)
    .findOne({ _id: id }, async (err, user) => {
      const todos = await db.getTodoCollection();
      let assignedtodos = [];
      for (let i = 0; i < todos.length; i++) {
        if (
          todos[i].user &&
          parseInt(todos[i].user._id) === parseInt(user._id)
        ) {
          assignedtodos.push(todos[i]);
        }
      }
      res.render("users/single-user", { user, assignedtodos });
    });
});

// GET single task edit
router.get("/:id/edit", async (req, res) => {
  const id = ObjectId(req.params.id);
  const database = await db.getDb();
  database.collection(USER_COLLECTION).findOne({ _id: id }, (err, user) => {
    res.render("users/edit", user);
  });
});

// POST single task edit
router.post("/:id/edit", async (req, res) => {
  const id = ObjectId(req.params.id);

  const updatedUser = {
    user: req.body.user,
  };
  if (utils.validateUpdatedUser(updatedUser)) {
    const database = await db.getDb();
    database
      .collection(USER_COLLECTION)
      .updateOne({ _id: id }, { $set: updatedUser });
    res.redirect("/");
  } else {
    res.sendStatus(400);
  }
});

//GET single user delete
router.get("/:id/delete", async (req, res) => {
  const id = ObjectId(req.params.id);
  const database = await db.getDb();
  database.collection(USER_COLLECTION).findOne({ _id: id }, (err, user) => {
    res.render("users/delete", user);
  });
});

// POST single user delete
router.post("/:id/delete", async (req, res) => {
  const id = ObjectId(req.params.id);
  const database = await db.getDb();
  const todos = await db.getTodoCollection();
  database
    .collection(USER_COLLECTION)
    .deleteOne({ _id: id }, async (err, user) => {
      for (let i = 0; i < todos.length; i++) {
        if (parseInt(todos[i].user._id) === parseInt(user._id)) {
          let taskId = todos[i].user._id;
          const updateTask = {
            assigned: false,
            user: {},
          };
          const database = await db.getDb();
          database
            .collection(USER_COLLECTION)
            .updateOne({ _id: taskId }, { $set: updateTask });
        }
      }
      res.redirect("/user/users");
    });
});

module.exports = router;
