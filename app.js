const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
let deptArr = [];
let roleArr = [];
let emplArr = [];

const connection = mysql.createConnection({
  host: "localhost",
  port: 3001,
  user: "root",
  password: "password",
  database: "eeTracker_db",
});

connection.connect(function (err) {
  if (err) throw err;
  start();
});
//main menu
function start() {
  inquirer
    .prompt({
      name: "menu",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update employee roles",
        "Exit"
      ]
    })
    .then((answer) => {
      switch (answer.menu) {
        case "View all departments":
          viewDepartment();
          break;
        case "View all roles":
          viewRole();
          break;
        case "View all employees":
          viewEmployee();
          break;
        case "Add a department":
          newDepartment();
          break;
        case "Add a role":
          newRole();
          break;
        case "Add an employee":
          newEmployee();
          break;
        case "Update employee roles":
          updateRole();
          break;
      }
    });
}

//view stuff
function viewDepartment() {
  connection.query("SELECT * FROM department", function (err, results) {
      if (err) throw err;
      console.table(deptArr);
      start();
  })
}

function viewRole() {
  connection.query("SELECT * FROM role", function (err, results) {
      if (err) throw err;
      console.table(roleArr);
      start();
  })
}

function viewEmployee() {
  connection.query("SELECT * FROM employee", function (err, results) {
      if (err) throw err;
      console.table(emplArr);
      start();
  })
}

//add stuff
function newDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What department do you want to add?"
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          department_name: answer.department,
        },
        function (err) {
          if (err) throw err;
          console.log("The department was created.");
        }
      );
      init();
    });
}

function newRole() {
  inquirer.prompt([
    {
      name: "title",
      type: "input",
      message: "What is the title of this new role?"
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary of this?",
    },
    {
      name: "deptID",
      type: "list",
      message: "What department will this new role be in?",
      choices: deptArr
    },
  ])
  .then(function (answer) {
    let deptID;
    for (let d = 0; d < res.length; d++) {
      if (res[d].department_name == answer.departmentName) {
        deptID = res[d].department_id;
      }
    }
    connection.query(
      "INSERT INTO role SET ?",
      {
        title: answer.title,
        salary: answer.salary,
        department_id: deptID,
      },
      function (err) {
        if (err) throw err;
      }
    );
    init();
  });
}

function newEmployee() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    connection.query("SELECT * FROM employee", function (err, res2) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?",
          },
          {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?",
          },
          {
            name: "roleName",
            type: "list",
            message: "What is the employee's role?",
            choices: roleArr,
          },
          {
            name: "managerName",
            type: "list",
            message: "Who is this employee's Manager?",
            choices: managerArr,
          },
        ])
        .then(function (answer) {
          let roleID;
          for (let r = 0; r < res.length; r++) {
            if (res[r].title == answer.roleName) {
              roleID = res[r].role_id;
            }
          }
          let managerID;
          for (let m = 0; m < res2.length; m++) {
            if (res2[m].last_name == answer.managerName) {
              managerID = res2[m].employee_id;
            }
          }
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: roleID,
              manager_id: managerID,
            },
            function (err) {
              if (err) throw err;
            }
          );
          init();
        });
    });
  });
}

function updateRole() {
  connection.query(
    `SELECT concat(employee.first_name, ' ' ,  employee.last_name) AS Name FROM employee`,
    function (err, employees) {
      if (err) throw err;
      emplArr = [];
      for (i = 0; i < employees.length; i++) {
        emplArr.push(employees[i].Name);
      }
      connection.query("SELECT * FROM role", function (err, res2) {
        if (err) throw err;
        inquirer
          .prompt([
            {
              name: "employeeChoice",
              type: "list",
              message: "Which employee would you like to update?",
              choices: emplArr,
            },
            {
              name: "roleChoice",
              type: "list",
              message: "What is the employee's new role?",
              choices: roleArr,
            },
          ])
          .then(function (answer) {
            let roleID;
            for (let r = 0; r < res2.length; r++) {
              if (res2[r].title == answer.roleChoice) {
                roleID = res2[r].role_id;
              }
            }
            connection.query(
              `UPDATE employee SET role_id = ? WHERE employee_id = (SELECT employee_id FROM(SELECT employee_id FROM employee WHERE CONCAT(first_name," ",last_name) = ?)AS NAME)`,
              [roleID, answer.employeeChoice],
              function (err) {
                if (err) throw err;
              }
            );
            init();
          });
      });
    }
  );
}