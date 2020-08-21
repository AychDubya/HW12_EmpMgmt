var mysql = require("mysql")
var inquirer = require("inquirer")
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_tracker",
})

connection.connect(function (err) {
    if (err) throw err
    start()
})

function start() {
    inquirer.prompt({
        name: "options",
        type: "list",
        message: "What do you want do?",
        choices: ["Add a department", "Add a role?", "Add an employee?", "View department?", "View roles?", "View employees?", "Update employee?","EXIT"]
    })
        .then(function (answers) {
            if (answers.options === "Add a department") {
                addDepartment()
            } else if (answers.options === "Add a role?") {
                addRole()
            }else if (answers.options === "Add an employee?") {
                addEmployee()
            }else if (answers.options === "View department?") {
                viewDep()
            }else if (answers.options === "View roles?") {
                viewRole()
            }else if (answers.options === "View employees?") {
                viewEmp()
            }else if (answers.options === "Update employee?") {
                updateEmp()
            }else{
                connection.end()
            }
        }
        )
}


function addDepartment() {
    inquirer.prompt({
        name: "department",
        type: "input",
        message: "What is the departmen's name?"
    }).then(function (answer) {
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: answer.department
            },
            function (err) {
                if (err) throw err
                start()
            }
        )
    })
}

function addRole() {
    inquirer.prompt(
     [   {
            name: "title",
            type: "input",
            message: "What is the role's name?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the role's salary?"
        },
        {
            name: "dep_id",
            type: "input",
            message: "What is the role's department id?"
        }]
    ).then(function (answer) {
        connection.query(
            "INSERT INTO role SET ?",
            {
                title: answer.title,
                salary:answer.salary,
                department_id:answer.dep_id
            },
            function (err) {
                if (err) throw err
                start()
            }
        )
    })
}
function addEmployee() {
    inquirer.prompt(
     [   {
            name: "name",
            type: "input",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?"
        },
        {
            name: "role_id",
            type: "input",
            message: "What is the employee's role id?"
        },
        {
            name: "manager_id",
            type: "input",
            message: "What is the employee's manager id?"
        }]
    ).then(function (answer) {
        console.log(answer);
        if(answer.manager_id === ""){
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.name,
                    last_name:answer.last_name,
                    role_id:answer.role_id,
                   
                },
                function (err) {
                    if (err) throw err
                    start()
                }
            )
        }else{
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.name,
                    last_name:answer.last_name,
                    role_id:answer.role_id,
                    manager_id:answer.manager_id
                },
                function (err) {
                    if (err) throw err
                    start()
                }
            )
        }
       
    })
}

function viewDep(){
    connection.query("SELECT * FROM department",
    function(err,res){
        if(err) throw err
        console.table(res)
        start()
    }
    )
}
function viewRole(){
    connection.query("SELECT * FROM role",
    function(err,res){
        if(err) throw err
        console.table(res)
        start()
    }
    )
}
function viewEmp(){
    connection.query("SELECT * FROM employee",
    function(err,res){
        if(err) throw err
        console.table(res)
        start()
    }
    )
}

function updateEmp(){
    inquirer.prompt(
        [   {
               name: "employee",
               type: "input",
               message: "What is the employee's id number"
           },
           {
               name: "newRole",
               type: "input",
               message: "What is the new role's id number?"
           }]
    ).then(function(answer){
        connection.query("UPDATE employee SET ? WHERE ?",
        [
            {
                role_id:answer.newRole
            },
            {
                id:answer.employee
            }
        ],
        function(err){
            if(err) throw err
            start()
        }
        )
    })
}
