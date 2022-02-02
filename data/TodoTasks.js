const getDate = require("../lib/getDate.js");

const todos = [
  {
    id: 1,
    created: getDate(),
    description: "Klappa katten",
    done: true,
  },
  {
    id: 2,
    created: getDate(),
    description: "Göra läxan",
    done: false,
  },
  {
    id: 3,
    created: getDate(),
    description: "PS. Click me to check, edit or delete me",
    done: false,
  },
];

module.exports = todos;
