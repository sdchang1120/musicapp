// REQUIREMENTS
var mongoose = require('mongoose');

// SETTING UP USER SCHEMA
var userSchema = mongoose.Schema({
  username: String,
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  playlist: []
})

var User = mongoose.model('User', userSchema);

// EXPORT USER
module.exports.User = User;
