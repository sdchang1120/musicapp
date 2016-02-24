// ====================
//     REQUIREMENTS
// ====================
var express = require('express');
var router = express.Router();
var User = require('../models/users.js').User;
var Playlist = require('../models/playlist.js').Playlist;
var Music = require('../models/music.js').Music;
var passport = require('passport');

// ====================
//        INDEX
// ====================

// ALL USERS
router.get('/', function(req, res) {
  res.locals.login = req.isAuthenticated();
  User.find({}, function(err, data) {
    // console.log(data);
    // renders users index page
    res.render('users/index.ejs', {users: data});
  });
});

// ALL USERS - JSON
router.get('/json', function(req, res) {
  User.find(function(err, users) {
    res.send(users);
  });
});

// ====================
//    AUTHENTICATION
// ====================

// SIGNUP - NEW USER
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

// ====================
//        NEW
// ====================

// NEW PLAYLIST FORM
router.get('/:id/newlist', function(req, res) {
  var id = req.params.id;
  // console.log(id);
  User.findById(id, function(err, user) {
    // console.log(user.id)
    res.render('users/newlist.ejs', user);
  })
})

// SHOW USER'S PLAYLIST - NEW SONG FORM
router.get('/:id/:list/newsong', function(req, res) {
  var id = req.params.id;
  var list = req.params.list;
  User.findById(id, function(err, user) {
    Playlist.findById(list, function(err, playlist) {
      res.render('users/newsong.ejs', {user: user, playlist: playlist});
    })
  })
})

// ====================
//    CREATE / POST
// ====================

// CREATE NEW PLAYLIST
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

// CREATE NEW SONG
router.post('/:id/:list/newsong', function(req, res) {
  var id = req.params.id;
  var list = req.params.list;
  var newMusic = new Music(req.body);
  newMusic.save(function(err, song) {
    User.update({_id: id, 'playlist._id': list}, {$push: {'playlist.$.music': song}}, function(err, playlist) {
      // console.log('PLAYLIST: ', playlist);
    })
    Playlist.findByIdAndUpdate(list, {$push: {music: newMusic}}, {new: true}, function(err) {
      res.redirect('/users/' + id +'/' + list);
    })
  })
})

// ====================
//        SHOW
// ====================

// SHOW USER'S PLAYLISTS
router.get('/:id', function(req, res) {
  req.params.id == req.user.id ? res.locals.usertrue = true : res.locals.usertrue = false;
  var id = req.params.id;
  // find user ID
  User.findById(id, function(err, user) {
    // console.log(user.playlist);
    // render user's show page
    res.render('users/show.ejs', {user: user});
  });
});

// SHOW USER'S PLAYLIST
router.get('/:id/:list', function(req, res) {
  var id = req.params.id;
  var list = req.params.list;
  // console.log(id);
  User.findById(id, function(err, user) {
    Playlist.findById(list, function(err, playlist) {
      // console.log('USER: ', user);
      // console.log('PLAYLIST: ', playlist);
      res.render('users/showplaylist.ejs', {user: user, playlist: playlist});
    })
  })
})

// router.get('/:id/:list', function(req, res) {
//   var id = req.params.id;
//   var list = req.params.list;
//   // console.log(id);
//   User.findById(id, function(err, user) {
//     Playlist.findById(list, function(err, playlist) {
//       // console.log('USER: ', user);
//       // console.log('PLAYLIST: ', playlist);
//       res.render('users/showplaylist.ejs', {user: user, playlist: playlist});
//     })
//   })
// })

// ====================
//         EDIT
// ====================

// EDIT USER'S PLAYLIST NAME
router.get('/:id/:list/editlist', function(req, res) {
  var id = req.params.id;
  var list = req.params.list;
  User.findById(id, function(err, user) {
    Playlist.findById(list, function(err, playlist) {
      // console.log('MUSIC LIST ARRAY: ', playlist.music);
      res.render('users/editlist.ejs', {user: user, playlist: playlist});
    })
  })
})

// ====================
//        UPDATE
// ====================

// UPDATE USER'S PLAYLIST NAME
router.put('/:id/:list', function(req, res) {
  var id = req.params.id;
  var list = req.params.list;
  console.log('USER ID: ', id);
  console.log('LIST ID: ', list);
  console.log('REQ.BODY: ', req.body);
  User.update({_id: id, 'playlist._id': list}, {$set: {'playlist.$.playlist_name': req.body.playlist_name}}, function(err) {
  });
  Playlist.findByIdAndUpdate(list, req.body, function(err, playlist) {
    res.redirect('/users/' + id + '/' + list);
  });
});

// ====================
//        DELETE
// ====================

// DELETE USER'S PLAYLIST
router.delete('/:id/:list', function(req, res) {
  var id = req.params.id;
  var list = req.params.list;
  // User.remove({_id: id, 'playlist._id': list}, function(err, data) {
  //   res.redirect('/users/' + id);
  // })
  Playlist.findByIdAndRemove(list, function(err) {
  });
  User.update({_id: id}, {$pull: {'playlist': {_id: list}}}, function(err) {
    res.redirect('/users/' + id);
  });
});

// ====================
// ISLOGGEDIN FUNCTION
// ====================

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

// EDIT USER'S PLAYLIST
// router.get('/:id/editlist', function(req, res) {
//   var id = req.params.id;
//   User.findById(id, function(err, user) {
//     res.render('users/editlist.ejs', user);
//   })
// })

// // EDIT USER'S PLAYLIST NAME
// router.get('/:id/editlist', function(req, res) {
//   var id = req.params.id;
//   var list = req.params.list;
//   User.findById(id, function(err, user) {
//     Playlist.findById(list, function(err, playlist) {
//       // console.log('MUSIC LIST ARRAY: ', playlist.music);
//       res.render('users/editlist.ejs', {playlist: playlist});
//     })
//   })
// })
