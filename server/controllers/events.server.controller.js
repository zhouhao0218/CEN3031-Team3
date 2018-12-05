
/* Dependencies */
var mongoose = require('mongoose');
var Event = require('../models/events.server.model.js');
var Role = require('../models/roles.server.model.js');

/* Create a event */
exports.create = function (req, res) {
	if (! (req.session && req.session.email && req.session.username && req.session.userid)) {
		res.status(409).end('Please login to create events');
		return;
	}
	var event = new Event(req.body);
	event.save(function (err) {
		if (err) {
			console.log(err);
			res.status(400).end();
		} else {
			var role = new Role({
				event: event._id,
				user: req.session.userid,
				host: true
			});
			role.save(function(err) {
				if (err) {
					console.log(err);
					res.status(400).end();
				} else {
					res.json(event);
				}
			});
		}
	});
};

/* Show the current event */
exports.read = function (req, res) {
	/* send back the event as json from the request */
	res.json(req.event);
};

exports.amihostforevent = function(req, res) {
	if (! (req.session && req.session.email && req.session.username && req.session.userid)) {
		res.status(400).end();
		return;
	}
	Role.find({ event : req.event._id, user : req.session.userid }, function(err, record) {
		if (err) {
			res.status(400).end();
		}
		if (record && record.length == 1&& record[0].host) {
			res.status(200).end();
		}
	});
};

exports.rolesPerEvent = function(req, res) {
	Role.find({ event : req.event._id }, function(err, record) {
		if (err) {
			res.status(400).end();
		}
		res.json(record);
	});
};

/* Update a event */
exports.update = function (req, res) {
	if (! (req.session && req.session.email && req.session.username && req.session.userid)) {
		res.status(400).end();
		return;
	}
	var attempt_update = function() {
		if (req.body.name && req.body.date && req.body.time && req.body.gamesavailable && req.body.location && req.body.image) {
			req.event.name = req.body.name;
			req.event.date = req.body.date;
			req.event.time = req.body.time;
			req.event.gamesavailable = req.body.gamesavailable;
			req.event.location = req.body.location;
			req.event.image = req.body.image;
		} else {
			res.status(400).end();
			return;
		}
		req.event.save(function(err, what) {
			if (err) {
				res.status(400).end();
			} else {
				res.json(what);
			}
		});
	};
	Role.find({ event : req.event._id, user : req.session.userid }, function(err, record) {
		if (err) {
			res.status(400).end();
			return;
		}
		if (record && record.length == 1 && record[0].host) {
			attempt_update();
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
