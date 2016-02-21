// REQUIREMENTS
var User = require('../models/users.js').User;
var LocalStrategy = require('passport-local').Strategy;

// expose this function to our app using module.exports
module.exports = function(passport) {

  console.log('PASSPORT CONFIG LOADED.')

  // ==================================================
  // PASSPORT SETUP
  // required for persistent login sessions passport
  // needs ability to serialize and unserialitze users
  // out of session
  // ==================================================

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // ==================================================
  // LOCAL SETUP
  // using named strategies since we have one login and
  // one for signup
  // by default, if there was no name, it would just be
  // called 'local'
  // ==================================================

  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {
    // asynchronous
    // User.findOne won't fire unless data is sent back
    process.nextTick(function() {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({'email': email}, function(err, user) {
        // if there are any errors, return the errors
        if (err)
          return done (err);

        // check to see if there's already a user with that email
        if (user) {
          return done(null, false);
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();

          console.log('REC.BODY IN LOCAL SIGNUP: ', req.body);

          // set the user's local credentials
          newUser.username = req.body.username;
          newUser.first_name = req.body.first_name;
          newUser.last_name = req.body.last_name;
          newUser.email = email;
          newUser.password = newUser.generateHash(password);
          // save the user
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  // ==================================================
  // LOCAL LOGIN
  // we are using named strategeies since we have one
  // for login and one for signup
  // by default, if there was no name, it would just be
  // called 'local'
  // ==================================================

  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'username',
    passportField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) { // callback with email and password from our form
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({'username': username}, function(err, user) {
      // if there are any erros, return the error before anything else
      if (err)
        return done(err);
      // if no user if found, return the message
      if (!user)
        return done(null, false); // req.flash is the way to set flashdata using connect-flash

      // if the user is found but the password is wrong
      if (!user.validPassword(password))
        return done(null, false); // create the loginMessage and save it to session as flashdata

      // all is well, return successful user
      return done(null, user);
    });
  }));

};
