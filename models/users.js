// REQUIREMENTS
var mongoose = require('mongoose');
// var Music = require('./music.js').schema;

// SETTING UP USER SCHEMA
var userSchema = mongoose.Schema({
  username: String,
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  // playlist: [musicSchema];
})

// model method - hashing password
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', userSchema);

// EXPORT USER
module.exports.User = User;
