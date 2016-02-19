// REQUIREMENTS
var mongoose = require('mongoose');

// SETTING UP MUSIC SCHEMA
var musicSchema = mongoose.Schema({
  title: String,
  artist: String,
  song: String
})

module.exports.Music = Music;
