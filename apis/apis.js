var express = require('express');
var app = express();

function setup() {
	app.use('/users', require('./users')());
	app.use('/employees', require('./employees')());
	return app;
}

module.exports = setup;