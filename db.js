// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',  // Replace with your MySQL host
    user: 'root',       // Replace with your MySQL username
    password: 'password', // Replace with your MySQL password
    database: 'mydatabase' // Replace with your MySQL database name
});

connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

module.exports = connection;
