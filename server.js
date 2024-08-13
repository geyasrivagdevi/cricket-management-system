require('dotenv').config();  // Load environment variables from .env file

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const initializePassport = require('./passport-config');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const mysql = require('mysql2');

const crud = require('./crud'); // Import CRUD operations

// Create a connection to the database using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10 // Adjust as needed
});

// Connection to DB
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Routes

// Create User
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  crud.createUser(name, email, password, (err, result) => {
    if (err) {
      return res.status(500).send('Error creating user');
    }
    res.status(201).json({ id: result.insertId });
  });
});

// Read Users
app.get('/users', (req, res) => {
  crud.getUsers((err, users) => {
    if (err) {
      return res.status(500).send('Error retrieving users');
    }
    res.json(users);
  });
});

// Read User by ID
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  crud.getUserById(userId, (err, user) => {
    if (err) {
      return res.status(500).send('Error retrieving user');
    }
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  });
});
  
// Update User
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;
    crud.updateUser(userId, name, email, password, (err, result) => {
      if (err) {
        return res.status(500).send('Error updating user');
      }
      if (result.affectedRows === 0) {
        return res.status(404).send('User not found');
      }
      res.send('User updated successfully');
    });
  });
  
  // Delete User
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    crud.deleteUser(userId, (err, result) => {
      if (err) {
        return res.status(500).send('Error deleting user');
      }
      if (result.affectedRows === 0) {
        return res.status(404).send('User not found');
      }
      res.send('User deleted successfully');
    });
  });

const PORT = process.env.PORT || 3000;

// Initialize Passport
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

const users = [];

app.set('view engine', 'ejs');
const path = require('path');
const { name } = require('ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// Routes
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

app.post("/register", checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        res.redirect("/login");
    } catch (e) {
        console.log(e);
        res.redirect("/register");
    }
});

app.get('/', checkAuthenticated, (req, res) => {
    res.render("index.ejs", { name: req.user.name });
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render("login.ejs");
});

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render("register.ejs");
});

app.delete("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});