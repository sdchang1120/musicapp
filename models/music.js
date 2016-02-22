// REQUIREMENTS
var mongoose = require('mongoose');

// SETTING UP MUSIC SCHEMA
var musicSchema = mongoose.Schema({
  song_title: String,
  artist: String,
  music_link: String
})

var Music = mongoose.model('Music', musicSchema);

module.exports.Music = Music;
