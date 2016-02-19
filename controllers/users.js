var express = require('express');
var router = express.Router();
// var User = require('../models/users.js').User;

router.get('/', function(req, res) {
  res.render('users/index.ejs');
});

module.exports = router;
