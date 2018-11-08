
/* Dependencies */
var mongoose = require('mongoose');
var Event = require('../models/events.server.model.js');

/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update events.
  On an error you should send a 404 status code, as well as the error message. 
  On success (aka no error), you should send the event(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions, refer back to this tutorial 
  from assignment 3 https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
*/

/* Create a event */
exports.create = function (req, res) {
	/* Instantiate a event */
	var event = new event(req.body);

	/* Then save the event */
	event.save(function (err) {
		if (err) {
			console.log(err);
			res.status(400).send(err);
		} else {
			res.json(event);
		}
	});
};

/* Show the current event */
exports.read = function (req, res) {
	/* send back the event as json from the request */
	res.json(req.event);
};

/* Update a event */
exports.update = function (req, res) {
	var event = req.event;
	if (req.body.name) {
		event.name = req.body.name;
	}
	if (req.body.date) {
		event.date = req.body.date;
	}
	if (req.body.time) {
		event.time = req.body.time;
	}
	if (req.body.gamesavailable) {
		event.gamesavailable = req.body.gamesavailable;
	}
	if (req.body.address) {
		event.address = req.body.address;
	}
	event.save(function(err, what) {
		if (err) {
			res.status(400).send(err);
		} else {
			res.json(what);
		}
	});
};

/* Delete a event */
exports.delete = function (req, res) {
	var event = req.event;
	event.remove(function(err) {
		if (err) {
			res.status(400).send(err);
		} else {
			res.send('');
		}
	});
};

/* Retreive all the directory events, sorted alphabetically by event code */
exports.list = function (req, res) {
	Event.find({}).sort('date').exec(function(err, items) {
		res.json(items);
	});
};

/* 
   Middleware: find a event by its ID, then pass it to the next request handler. 

   Find the event using a mongoose query, 
   bind it to the request object as the property 'event', 
   then finally call next
*/
exports.eventByID = function (req, res, next, id) {
	Event.findById(id).exec(function (err, event) {
		if (err) {
			res.status(400).send(err);
		} else {
			req.event = event;
			next();
		}
	});
};
