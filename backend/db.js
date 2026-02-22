const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  port: 3307,    
  user: "root",
  password: "root@123",
  database: "smartwatt"
});

db.connect();
module.exports = db;