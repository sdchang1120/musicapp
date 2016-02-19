// REQUIREMENTS
var mongoose = require('mongoose');

// SETTING UP MUSIC SCHEMA
var musicSchema = mongoose.Schema({
  playlist_title: String,
  song_title: String,
  artist: String,
  music_link: String
})

module.exports.Music = Music;
