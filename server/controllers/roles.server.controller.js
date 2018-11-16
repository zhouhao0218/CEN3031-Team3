var mongoose = require('mongoose');
var Roles = require('../models/roles.server.model.js');
var Events = require('../models/events.server.model.js');

exports.create = function (req, res) {
	if (! (req.session && req.session.email && req.session.username && req.session.userid)) {
		res.status(409).end('Please login to register for events');
		return;
	}
	if (! req.body.event) {
		res.status(400).end();
		return;
	}
	var evt_id = req.body.event;
	var user_id = req.session.userid;
	var role = new Roles({
		user : user_id,
		event : evt_id,
		host : false,
	});
	var save_role = function(err) {
		if (err) {
			res.status(400).end();
		} else {
			res.status(200).end();
		}
	};
	var already_registered = function(err, record) {
		if (err) {
			res.status(400).end();
		} else if (record.length > 0) {
			if (record[0].host) {
				res.status(409).end('You are hosting this event');
			} else {
				res.status(409).end('You already registered');
			}
		} else {
			role.save(save_role);
		}
	};
	var find_evt = function(err, evt) {
		if (err) {
			res.status(409).end('Event does not exist');
		} else {
			Roles.find({ user : user_id, event : evt_id }, already_registered);
		}
	};
	Events.findById(evt_id).exec(find_evt);
};

exports.read = function (req, res) {
	res.json(req.role);
};

exports.update = function (req, res) {
	var role = req.role;
	if (! (req.body.user && req.body.event && req.body.host)) {
		res.status(400).end();
		return;
	}
	role.save(function(err, what) {
		if (err) {
			res.status(400).send(err);
		} else {
			res.json(what);
		}
	});
};

exports.delete = function (req, res) {
	var role = req.role;
	role.remove(function(err) {
		if (err) {
			res.status(400).end();
		} else {
			res.status(200).end();
		}
	});
};

exports.list = function (req, res) {
	Roles.find({}).exec(function(err, items) {
		res.json(items);
	});
};

exports.roleByID = function (req, res, next, id) {
	Roles.findById(id).exec(function (err, role) {
		if (err) {
			res.status(400).end();
		} else {
			req.role = role;
			next();
		}
	});
};
