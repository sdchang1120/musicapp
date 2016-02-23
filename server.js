// ====================
// REQUIREMENTS
// ====================
var express        = require('express'),
    app            = express(),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose  = require('mongoose'),
    passport       = require('passport'),
    session        = require('express-session'),
    port           = 3000 || process.env.PORT;

// CONNECT TO MONGO DB MUSIC_APP
mongoose.connect('mongodb://localhost/music_app');

require('./config/passport.js')(passport) // pass possport for configuration

// SET UP STATIC PUBLIC FILES
app.use(express.static('public'));

// SET UP BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// SET UP METHOD OVERRIDE
// app.use(methodOverride('_method'));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// PASSPORT REQUIREMENT
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret; shows cookies
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// CONTROLLERS
var usersController = require('./controllers/users.js');
app.use('/users', usersController);
var musicController = require('./controllers/music.js');
app.use('/music', musicController);

// INDEX PAGE
app.get('/', function(req, res) {
	res.redirect('/users');
});

// ====================
// LISTEN ON PORT 3000
// ====================
mongoose.connection.once('open', function() {
  app.listen(port, function() {
    console.log('====================');
    console.log('Running on port ' + port);
    console.log('====================');
  });
});
