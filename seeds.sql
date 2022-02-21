use eeTracker_db

INSERT INTO department (name)
  VALUE ("Shipping"),
  ("Factory"),
  ("HR"),
  ("Finance");

INSERT INTO role (title, salary, department_id)
  VALUE ("Forklift-Operator", 65000.00, 1),
  ("Shipping-Manager", 75000.00, 1),
  ("Operator-1", 65000.00, 2),
  ("Operator-2", 70000.00, 2),
  ("Shift-Lead", 80000.00, 2),
  ("Shift-Supervisor", 900000.00, 2),
  ("Human-Resources", 65000.00, 3),
  ("Accountant", 50000.00, 4),               
  ("Senior Accountant", 80000.00, 4),    

INSERT INSERT employee (first_name, last_name, role_id, manager_id)

