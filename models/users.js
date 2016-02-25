// REQUIREMENTS
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var playlistSchema = require('./playlist.js').Playlist.schema;

// SETTING UP USER SCHEMA
var userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  first_name: {type: String, required: true},
  last_name: String,
  email: String,
  password: {type: String, required: true},
  playlist: [playlistSchema]
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
