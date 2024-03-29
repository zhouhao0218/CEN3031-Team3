var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = require('./config');
var accountsRouter = require('../routes/accounts.server.routes');
var eventsRouter = require('../routes/events.server.routes');
var gamesRouter = require('../routes/games.server.routes');
var rolesRouter = require('../routes/roles.server.routes');
var meRouter = require('../routes/me.server.routes');

module.exports.init = function () {
	//connect to database
	mongoose.connect(config.db1.uri);
	mongoose.connect(config.db2.uri);
	mongoose.connect(config.db3.uri);

	//initialize app
	var app = express();

	//enable request logging for development debugging
	app.use(morgan('dev'));

	//body parsing middleware 
	app.use(bodyParser.json());

	app.use(session({
		secret: 'isdjfkjasdflkjasdf',
		resave: false,
		saveUninitialized: true,
	}));

	/* Serve static files */
	app.use(express.static('client'));

	/* Use the listings router for requests to the api */
	app.use('/api/accounts', accountsRouter);
	app.use('/api/events', eventsRouter);
	app.use('/api/games', gamesRouter);
	app.use('/api/roles', rolesRouter);
	app.use('/api/me', meRouter);

	app.use('/api/', function(req, res, next) {
		res.status(404).end();
	});
	/* Go to homepage for all routes not specified */
	app.use(function (req, res, next) {
		res.redirect('/');
	});

	return app;
};  
