// ====================
//     REQUIREMENTS
// ====================
var express = require('express');
var router = express.Router();
var Playlist = require('../models/playlist.js').Playlist;

// ====================
//        INDEX
// ====================

// ALL USERS
router.get('/', function(req, res) {
    res.redirect('/playlist/json');
});

// ALL USERS - JSON
router.get('/json', function(req, res) {
  Playlist.find(function(err, playlist) {
    res.send(playlist);
  });
});

module.exports = router;
