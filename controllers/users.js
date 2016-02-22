var express = require('express');
var router = express.Router();
var User = require('../models/users.js').User;
var Playlist = require('../models/playlist.js').Playlist;
var Music = require('../models/music.js').Music;
var passport = require('passport');

// INDEX ALL USERS
router.get('/', function(req, res) {
  res.locals.login = req.isAuthenticated();
  User.find({}, function(err, data) {
    // console.log(data);
    // renders users index page
    res.render('users/index.ejs', {users: data});
  });
});

// JSON FOR ALL USERS
router.get('/json', function(req, res) {
  User.find(function(err, users) {
    res.send(users);
  });
});

// SIGNUP
router.post('/', passport.authenticate('local-signup', {
  failureRedirect : '/users' // redirect back to the signup page if there is an error
}), function(req, res) {
  res.redirect('/users/'+req.user.id); // req.user can be called bc of passport.js
});

// LOGIN
router.post('/login', passport.authenticate('local-login', {failureRedirect : '/users'}), function(req, res) {
  // console.log(req.user.id);
  res.redirect('/users/'+req.user.id);
});

// LOGOUT
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/users');
});

// SHOW USER ID - USER'S PLAYLISTS
router.get('/:id', isLoggedIn, function(req, res) {
  req.params.id == req.user.id ? res.locals.usertrue = true : res.locals.usertrue = false;
  // find user ID
  User.findById(req.params.id, function(err, user) {
    // console.log(user.playlist);
    // render user's show page
    res.render('users/show.ejs', user);
  });
});

// NEW PLAYLIST FORM
router.get('/:id/newlist', function(req, res) {
  var id = req.params.id;
  // console.log(id);
  User.findById(id, function(err, user) {
    // console.log(user.id)
    res.render('users/newlist.ejs', user);
  })
})

// NEW SONG FORM
router.get('/:id/:list', function(req, res) {
  var id = req.params.id;
  var list = req.params.list;
  // console.log(id);
  User.findById(id, function(err, user) {
    Playlist.findById(list, function(err, playlist) {
      // console.log('USER: ', user);
      // console.log('PLAYLIST: ', playlist);
      res.render('users/newsong.ejs', {user: user, playlist: playlist});
    })
  })
})

// POST NEW PLAYLIST NAME
router.post('/:id/newlist', function(req, res) {
  var id = req.params.id;
  var newPlaylist = new Playlist(req.body);
  newPlaylist.save(function(err, playlist) {
    // console.log('new playlist: ', playlist);
    // console.log('new playlist id: ', playlist.id);
    User.findByIdAndUpdate(id, {$push: {playlist: newPlaylist}}, {new: true}, function(err) {
      res.redirect('/users/' + id + '/' + playlist.id);
    });
  })
})

// POST NEW SONG
router.post('/:id/:list', function(req, res) {
  var id = req.params.id;
  var list = req.params.list;
  var newMusic = new Music(req.body);
  newMusic.save(function(err, song) {
    User.update({_id: id, 'playlist._id': list}, {$push: {'playlist.$.music': song}}, function(err, playlist) {
      console.log('PLAYLIST: ', playlist);
    })
    Playlist.findByIdAndUpdate(list, {$push: {music: newMusic}}, {new: true}, function(err) {
      res.redirect('/users/' + id +'/' + list);
    })
  })
})

// isLoggedIn function
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the users page
    res.redirect('/users');
}

module.exports = router;

// ==============
// ARCHIEVED CODE
// ==============

// router.get('/:id/newlist/newsong', function(req, res) {
//   var id = req.params.id;
//   var newSong = new Music(req.body);
//   newSong.save(function(err, song) {
//     console.log(song);
//     User.findByIdAndUpdate(id, {$push: {music: song}}, {new: true}, function(err) {
//       res.redirect('/users/' + id)
//     })
//   })
// })

// router.get('/:id/:playlist/newsong', function(req, res) {
//   var id = req.params.id;
//   var playlist = id.playlist;
//   var newSong = new Music(req.body);
//   newSong.save(function(err, song) {
//     console.log(song);
//     User.findByIdAndUpdate(id, {$push: {music: song}}, {new: true}, function(err) {
//       res.redirect('/users/' + id)
//     })
//   })
// })
