if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const initializePassport = require('./passport-config');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');


const PORT = process.env.PORT || 3001;

// Initialize Passport
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

const users = [];

app.set('view engine', 'ejs');
const path = require('path');
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

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
