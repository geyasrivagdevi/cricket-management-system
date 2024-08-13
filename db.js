
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,  // Replace with your MySQL host
  user: process.env.DB_USER,      // Replace with your MySQL username
  password: process.env.DB_PASSWORD, // Replace with your MySQL password
  database: process.env.DB_NAME, // Replace with your MySQL database name
});

connection.connect(function(err) {
    if (err) {
      console.error('Error connecting: ' + err.stack);
      return;
    }
    console.log('Connected as id ' + connection.threadId);
  });

module.exports = connection;