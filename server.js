const inquirer = require("inquirer");
const connection = require("./db/connection")
const cTable = require("console.table");

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

function viewAllRoles() {
  connection.query(
    "SELECT role.id AS ID, title AS Title, salary AS Salary, department_id AS Department FROM role",
    function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.table("Roles: \n", res);
      }
      menuPrompt();
    }
  );
}

function viewAllEmployees() {
  connection.query(
    'SELECT employee.id AS ID, employee.first_name AS "First Name", employee.last_name AS "Last Name", department.department_name AS Department, role.title AS "Role", role.salary AS Salary, CONCAT(manager.first_name, " ", manager.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON manager.id = employee.manager_id;',
    function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.table("Employees:", res);
      }
      menuPrompt();
    }
  );
}

function addDepartment() {}

function addRole() {}

function addEmployee() {}

function updateEmployee() {}
