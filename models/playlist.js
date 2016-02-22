var mongoose = require('mongoose');
var musicSchema = require('./music.js').Music.schema;

var playlistSchema = mongoose.Schema({
  playlist_name: String,
  music: [musicSchema]
})

var Playlist = mongoose.model('Playlist', playlistSchema);

module.exports.Playlist = Playlist;
