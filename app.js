

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const flash = require('connect-flash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const homeStartingContent = "Your starting content goes here";
const posts = [
  {
    title: "Post 1",
    content: "This is the content for post 1."
  },
  {
    title: "Post 2",
    content: "This is the content for post 2."
  },
  {
    title: "Post 3",
    content: "This is the content for post 3."
  }
];


mongoose.set('strictQuery', false );
mongoose.connect('mongodb://127.0.0.1:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });


// Your existing schemas and routes here

// Additional routes for login and other pages
app.get("/", function(req, res) {
  // Your existing code to retrieve posts
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts,
    user: req.user
  });
});

app.get('/login', function(req, res) {
  res.render('login', { user: req.user, message: req.flash('error') });
});

app.post('/register', function(req, res) {
  User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    }
  });
});


app.get('/register', function(req, res) {
  res.render('register', { user: req.user, message: req.flash('error') });
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Automatically register a new user
      User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if (err) {
          console.log(err);
          return res.redirect('/login');
        } else {
          // Log in the new user
          passport.authenticate('local')(req, res, function() {
            return res.redirect('/');
          });
        }
      });
    } else {
      // Log in existing user
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.redirect('/');
      });
    }
  })(req, res, next);
});



app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

app.get('/catmocks', function(req, res) {
  res.render('catmocks', { user: req.user });
});

app.get('/connect', function(req, res) {
  res.render('connect', { user: req.user });
});

app.get('/colleges', function(req, res) {
  res.render('colleges', { user: req.user });
});

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.listen(4000, function() {
  console.log("Server started on port 4000");
});
