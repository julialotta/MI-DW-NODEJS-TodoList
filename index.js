require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const taskRouter = require("./routers/task-router");
const userRouter = require("./routers/user-router");
/* const morgan = require("morgan");
 */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/* app.use(morgan("common"));
 */

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

app.use("/", taskRouter);
app.use("/user", userRouter);

app.listen(8000, () => {
  console.log("http://localhost:8000");
});
