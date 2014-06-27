var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var APIs = require('./apis/apis.js');
var compress = require('compression');
var auth = require('./services/auth');
var config = require('./config.json');
var _ = require('lodash');
var User = require('./models/user.js');
var favicon = require('serve-favicon');

var app = express();

app.set('port', process.env.PORT || config.port || 3000);
app.use(compress());

app.use(favicon(path.join(__dirname, '/public/images/favicon.ico')));


app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(cookieParser());


// Session setup
var sessionOptions = _.extend(
  config.sessionOptions, {
    store: new MongoStore(config.database)
  });
app.use(session(sessionOptions));

// Initialize authentication service
auth.initialize(app, User);

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: 86400000
}));

//BUGBUG: Is this needed?
app.use(function(req, res, next) {
  if (req.user) {
    res.cookie('user', JSON.stringify(req.user));
  }
  next();
});

// Setup database connection
var dbUrl = 'mongodb://';
if (config.database.username) {
  dbUrl += config.database.username + ':' + config.database.password + '@';
}
dbUrl += config.database.host + ':' + config.database.port;
dbUrl += '/' + config.database.db;

mongoose.connect(dbUrl);
mongoose.connection.on('error', function() {
  console.err('MongoDB Connection Error. Make sure MongoDB is running.');
});

// Define APIs
app.use('/api', APIs());

// Reroute all unknown URLs to home
app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, {
    message: err.message
  });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});