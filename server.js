// REQUIREMENTS
var express   = require('express'),
    app       = express(),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    // mongoose  = require('mongoose'),
    port      = 3000 || process.env.PORT;
    User = require('./models/users.js').User;

// SET UP STATIC PUBLIC FILES
app.use(express.static('public'));

// SET UP BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// SET UP METHOD OVERRIDE
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// CONTROLLERS
var usersController = require('./controllers/users.js');
app.use('/users', usersController);

app.get('/', function(req, res) {
	res.render('index.ejs');
});

// CONNECT TO MONGOOSE
// mongoose.connect('mongodb://localhost/maps_models');

// LISTEN ON PORT 3000
// mongoose.connection.once('open', function() {
  app.listen(port, function() {
    console.log('====================');
    console.log('Running on port ' + port);
    console.log('====================');
  });
// })
