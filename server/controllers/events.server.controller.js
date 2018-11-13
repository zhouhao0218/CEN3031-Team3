
/* Dependencies */
var mongoose = require('mongoose');
var Event = require('../models/events.server.model.js');
var Account = require('../models/accounts.server.model.js');

/* Create a event */
exports.create = function (req, res) {
	if (! (req.session && req.session.email && req.session.username && req.session.userid)) {
		res.status(409).end('Please login to create events');
		return;
	}
	/* Instantiate a event */
	var event = new Event(req.body);
	/* Then save the event */
	event.save(function (err) {
		if (err) {
			console.log(err);
			res.status(400).send(err);
		} else {
			Account.findByIdAndUpdate(req.session.userid, {
				$push : {
					my_events : {
						hosting : true,
						event_id : event._id,
					}
				}
			}, null, function(err, doc) {
				if (err) {
					console.log(err);
				}
			});
			res.json(event);		
		}
	});
};

exports.register_for = function(req, res) {
	if (! (req.session && req.session.email && req.session.username && req.session.userid)) {
		res.status(409).end('Please login to register for events');
		return;
	}
	Account.findById(req.session.userid, function(err, acct) {
		if (err) {
			console.log(err);
			res.status(400).end();
			return;
		}
		for (var i = 0; i < acct.my_events.length; ++i) {
			if (acct.my_events[i].event_id.toString() == req.event._id.toString()) {
				if (acct.my_events[i].hosting) {
					res.status(409).end('You cannot register for an event you are hosting');
				} else {
					res.status(409).end('Already registered');
				}
				return;
			}
		}
		console.log('sssss');
		acct.update({
			$push : {
				my_events : {
					hosting : false,
					event_id : req.event._id,
				}
			}
		}, null, function(err, doc) {
			if (err) {
				console.log(err);
				res.status(400).end();
			} else {
				res.status(200).end();
			}
		});
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
	} else {
		req.status(400).end();
	}
	if (req.body.date) {
		event.date = req.body.date;
	} else {
		req.status(400).end();
	}
	if (req.body.time) {
		event.time = req.body.time;
	} else {
		req.status(400).end();
	}
	if (req.body.gamesavailable) {
		event.gamesavailable = req.body.gamesavailable;
	} else {
		req.status(400).end();
	}
	if (req.body.address) {
		event.address = req.body.address;
	} else {
		req.status(400).end();
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
