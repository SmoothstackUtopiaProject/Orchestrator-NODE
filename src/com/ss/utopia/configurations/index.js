const mysql = require("mysql");

const myDB = mysql.createConnection({
  host: "utopiaairlines-mysql.clufugeeqpsu.us-east-1.rds.amazonaws.com",
  user: "aws",
  password: "UtopiaAirlines1",
  database: "utopia",
  port: 3306,
});

const port = 8081;

myDB.connect((error) => {
  if(error) {
    console.error(error);
  } else {
    console.log("Good to go! Connected to DB.");
  }
});

module.exports = myDB;
