var express = require('express'),
  app = express(),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

function initialize(mainApp, User) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy({ 
    usernameField: 'email' },
    function(email, password, done) {
      User.findOne({ email: email }, 
        function(err, user) {
          if (err) return done(err);
          if (!user) return done(null, false);
          user.comparePassword(password, function(err, isMatch) {
            if (err) return done(err);
            if (isMatch) return done(null, user);
            return done(null, false);
          });
        });
    }));

  // NOTE: mainApp must be used since passport needs to
  // inject properties onto the request object. Since we
  // are using 'routing', calling these methods on the
  // local 'app' object will result in the passport properties
  // only getting injected if a 'users' api is called and thus
  // render ensureAuthenticated invalid since the passport
  // properties would not have been set.ß
  mainApp.use(passport.initialize());
  mainApp.use(passport.session());
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) next();
  else res.send(401);
}

module.exports = {
  initialize: initialize,
  authenticate: passport.authenticate('local'),
  ensureAuthenticated: ensureAuthenticated
};


