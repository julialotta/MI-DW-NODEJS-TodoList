const express = require("express");
const exphbs = require("express-handlebars");
const todos = require("./data/TodoTasks.js");

const app = express();
app.use(express.json());

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");
app.use(express.static("public"));

/* ? */
app.use(express.urlencoded({ extended: true }));

function getNewId(list) {
  let maxId = 0;
  for (const item of list) {
    if (item.id > maxId) {
      maxId = item.id;
    }
  }
  return maxId + 1;
}

app.get("/", (req, res) => {
  res.render("home", { todos });
});

app.get("/uncompletedtasks", (req, res) => {
  res.render("uncompleted-tasks", { todos });
});

app.get("/completedtasks", (req, res) => {
  res.render("completed-tasks", { todos });
});

app.get("/:id", (req, res) => {
  res.render("single-task", { todos });
});

app.post("/newtask", (req, res) => {
  const id = getNewId(todos);
  const todaysDate = new Date();
  const newTodo = {
    id: id,
    created:
      todaysDate.getFullYear() +
      "-" +
      parseInt(todaysDate.getMonth() + 1) +
      "-" +
      todaysDate.getDate() +
      " " +
      todaysDate.getHours() +
      ":" +
      todaysDate.getMinutes(),
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

app.listen(8000, () => {
  console.log("http://localhost:8000");
});

/* 
app.post("/intakter/:id/ta-bort", (req, res) => {
  const id = parseInt(req.params.id);
  const income = incomes.find((i) => i.id === id);
  incomes.splice(income, 1);
  res.redirect("/intakter");
});

app.get("/intakter/:id/redigera", (req, res) => {
  const id = parseInt(req.params.id);
  const index = incomes.find((i) => i.id === id);

  res.render("incomes-edit", index);
});

app.post("/intakter/:id/redigera", (req, res) => {
  const id = parseInt(req.params.id);
  const index = incomes.findIndex((i) => i.id === id);
  incomes[index].title = req.body.title;
  incomes[index].value = req.body.value;

  res.redirect("/intakter/" + id);
});

 */
