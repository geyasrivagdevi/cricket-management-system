const mysql = require('mysql2');
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10
});

// Create User
const createUser = (name, email, password, callback) => {
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, password], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

// Get Users
const getUsers = (callback) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Get User by ID
const getUserById = (id, callback) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

// Update User
const updateUser = (id, name, email, password, callback) => {
  const sql = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
  db.query(sql, [name, email, password, id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

// Delete User
const deleteUser = (id, callback) => {
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};