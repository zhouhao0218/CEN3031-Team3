var config = require('./config');
var mongoose = require('mongoose');   
var express = require('./express');

module.exports.start = function() {
	var app = express.init();
	app.listen(config.port, function() {
		console.log('App listening on port', config.port);
	});
};
