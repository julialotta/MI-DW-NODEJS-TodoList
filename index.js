const express = require("express");
const exphbs = require("express-handlebars");
const todos = require("./data/TodoTasks.js");
const morgan = require("morgan");

const app = express();
app.use(express.json());
/* app.use(morgan("common")); */

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");
app.use(express.static("public"));

/* vad betyder extended? */
app.use(express.urlencoded({ extended: false }));

function getNewId(list) {
  let maxId = 0;
  for (const item of list) {
    if (item.id > maxId) {
      maxId = item.id;
    }
  }
  return maxId + 1;
}

function getDate() {
  const todaysDate = new Date();
  const newDate =
    todaysDate.getFullYear() +
    "-" +
    parseInt(todaysDate.getMonth() + 1) +
    "-" +
    todaysDate.getDate() +
    " " +
    todaysDate.getHours() +
    ":" +
    todaysDate.getMinutes();
  return newDate;
}

app.get("/", (req, res) => {
  console.log(todos);
  res.render("home", { todos });
});

app.get("/uncompletedtasks", (req, res) => {
  res.render("uncompleted-tasks", { todos });
});

app.get("/completedtasks", (req, res) => {
  res.render("completed-tasks", { todos });
});

app.post("/newtask", (req, res) => {
  const id = getNewId(todos);
  const date = getDate();
  const newTodo = {
    id: id,
    created: date,
    description: req.body.description,
    done: false,
  };
  todos.push(newTodo);
  res.redirect("/");
});

app.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = todos.find((i) => i.id === id);
  res.render("single-task", task);
});

app.get("/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.find((i) => i.id === id);
  res.render("edit", index);
});

app.post("/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((i) => i.id === id);
  todos[index].created = req.body.created;
  todos[index].description = req.body.description;
  if (req.body.done) {
    todos[index].done = true;
  } else {
    todos[index].done = false;
  }
  res.redirect("/" + id);
});

app.get("/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.find((i) => i.id === id);
  res.render("delete", index);
});

app.post("/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((i) => i.id === id);
  todos.splice(index, 1);
  res.redirect("/");
});

app.listen(8000, () => {
  console.log("http://localhost:8000");
});
