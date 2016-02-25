// ====================
//     REQUIREMENTS
// ====================
var express = require('express');
var router = express.Router();
var Music = require('../models/music.js').Music;

// ====================
//        INDEX
// ====================

// ALL USERS
router.get('/', function(req, res) {
    res.redirect('/music/json');
});

// ALL USERS - JSON
router.get('/json', function(req, res) {
  Music.find(function(err, music) {
    res.send(music);
  });
});

module.exports = router;
