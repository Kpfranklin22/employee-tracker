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

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "dept_name",
        type: "input",
        message: "What is the name of the department?",
      },
    ])
    .then((answers) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          department_name: answers.dept_name,
        },
        function (err, res) {
          if (err) throw err;
          console.log(`${answers.dept_name} department added to table.`);
          menuPrompt();
        }
      );
    });
}

function addRole() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    let allDepartments = res.map((dept) => ({
      name: dept.department_name,
      value: dept.id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the role title?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary for this role?",
        },
        {
          type: "list",
          name: "dept",
          message: "Which department does this role operate in?",
          choices: allDepartments,
        },
      ])
      .then((answers) => {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answers.title,
            salary: answers.salary,
            department_id: answers.dept,
          },
          function (err, res) {
            if (err) throw err;
            console.log(`${answers.title} role confirmed and added to database.`);
            menuPrompt();
          }
        );
      });
  });
}

function addEmployee() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    let allRoles = res.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    connection.query(
      "SELECT * FROM employee WHERE manager_id IS null",
      function (err, res) {
        if (err) throw err;
        let allManagers = res.map((manager) => ({
          name: manager.first_name + " " + manager.last_name,
          value: manager.id,
        }));

        inquirer
          .prompt([
            {
              type: "input",
              name: "first_name",
              message: "What is the employees first name?",
            },
            {
              type: "input",
              name: "last_name",
              message: "What is the employee's last name?",
            },
            {
              type: "list",
              name: "role",
              message: "What is the employee's role?",
              choices: allRoles,
            },
            {
              type: "list",
              name: "manager",
              message: "Who is the employee's manager?",
              choices: allManagers,
            },
          ])
          .then((answers) => {
            connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name: answers.first_name,
                last_name: answers.last_name,
                role_id: answers.role,
                manager_id: answers.manager,
              },
              function (err, res) {
                if (err) throw err;
                console.log(
                  `New employee, ${answers.first_name} ${answers.last_name}, confirmed and added to database`
                );

                menuPrompt();
              }
            );
          });
      }
    );
  });
}

function updateEmployee() {
  connection.query(
    "SELECT * FROM employee RIGHT JOIN role on employee.role_id=role.id",
    function (err, res) {
      if (err) throw err;

      let allEmployees = res.map((emp) => ({
        name: emp.first_name + " " + emp.last_name,
        value: emp.id,
      }));

      connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;

        let allRoles = res.map((role) => ({
          name: role.title,
          value: role.id,
        }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "employee",
              message: "Select an existing employee.",
              choices: allEmployees,
            },
            {
              type: "list",
              name: "new_role",
              message: "Select a new role for this employee.",
              choices: allRoles,
            },
          ])
          .then((answers) => {
            connection.query(
              `UPDATE employee SET role_id=${answers.new_role} WHERE employee.id=${answers.employee}`,
              function (err, res) {
                if (err) throw err;
                console.log(`Employee update confirmed and added to database.`);
                menuPrompt();
              }
            );
          });
      });
    }
  );
}
