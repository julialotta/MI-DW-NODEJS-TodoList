const getDate = require("../lib/getDate.js");

const todos = [
  {
    id: 1,
    created: getDate(),
    description: "Something important",
    done: true,
  },
  {
    id: 2,
    created: getDate(),
    description: "Something productive",
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
