var express = require('express');
var router = express.Router();
var User = require('../models/users.js').User;
// var Music = require('../models/music.js').Music;
var passport = require('passport');

// INDEX ALL USERS
router.get('/', function(req, res) {
  res.locals.login = req.isAuthenticated();
  User.find({}, function(err, data) {
    console.log(data);
    // renders users index page
    res.render('users/index.ejs', {users: data});
  });
});

// JSON FOR ALL USERS
router.get('/json', function(req, res) {
  User.find(function(err, users) {
    res.send(users);
  });
});

// LOGIN
router.post('/login', passport.authenticate('local-login', {failureRedirect : '/users'}), function(req, res) {
  // console.log(req.user.id);
  res.redirect('/users/'+req.user.id);
});

// LOGOUT
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/users');
});

// SHOW USER ID
router.get('/:id', isLoggedIn, function(req, res) {
  req.params.id == req.user.id ? res.locals.usertrue = true : res.locals.usertrue = false;
  // find user ID
  User.findById(req.params.id, function(err, user) {
    // render user's show page
    res.render('users/show.ejs', user);
  });
});

// SIGNUP
router.post('/', passport.authenticate('local-signup', {
  failureRedirect : '/users' // redirect back to the signup page if there is an error
}), function(req, res) {
  res.redirect('/users/'+req.user.id); // req.user can be called bc of passport.js
});

// isLoggedIn function
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the users page
    res.redirect('/users');
}

module.exports = router;
