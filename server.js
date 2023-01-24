const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Makeitwork22",
  database: "employee_tracker_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Initiating program -Employee Tracker-");
  console.log("");
  console.log("Host: Local");
  console.log("");
  console.log("User: Confirmed");
  console.log("");
  console.log("Connection: Established");
  console.log("");
  console.log("All systems go for launch");
  console.log("");

  menuPrompt();
});

const menu = [
  {
    type: "list",
    name: "menuChoices",
    message: "Welcome to -Employee Tracker- Choose a command:",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
      "Quit",
    ],
  },
];

function menuPrompt() {
  inquirer
    .prompt(menu)
    .then((answers) => {
      menuSwitch(answers.menuChoices);
    })
    .catch((error) => console.log(error));
}

function menuSwitch(answers) {
  switch (answers) {
    case "View all departments":
      viewAllDepartments();
      break;

    case "View all roles":
      viewAllRoles();
      break;

    case "View all employees":
      viewAllEmployees();
      break;

    case "Add a department":
      addDepartment();
      break;

    case "Add a role":
      addRole();
      break;

    case "Add an employee":
      addEmployee();
      break;

    case "Update an employee role":
      updateEmployee();
      break;

    case "Quit":
      console.log("Exiting program.");
      connection.end();
      break;
  }
}

function viewAllDepartments() {
  connection.query(
    "SELECT department.id AS ID, department_name AS Department FROM department",
    function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.table("Departments: \n", res);
      }
      menuPrompt();
    }
  );
}

function viewAllRoles() {}

function viewAllEmployees() {}

function addDepartment() {}

function addRole() {}

function addEmployee() {}

function updateEmployee() {}