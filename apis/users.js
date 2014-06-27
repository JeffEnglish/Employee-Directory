var express = require('express'),
  app = express(),
  auth = require('../services/auth'),
  User = require('../models/user');

function setup() {
  return app
    .post('/login', auth.authenticate, login)
    .get('/logout', logout)
    .post('/signup', signup)
}

module.exports = setup;

function login(req, res) {
  res.cookie('user', JSON.stringify(req.user));
  res.send(req.user);
}

function logout(req, res) {
  req.logout();
  res.send(200);
}

function signup(req, res, next) {
  var user = new User({
    email: req.body.email,
    password: req.body.password
  });
  user.save(function(err) {
    if (err) return next(err);
    res.send(200);
  });
}