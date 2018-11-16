var mongoose = require('mongoose');
var Roles = require('../models/roles.server.model.js');

exports.create = function (req, res) {
	if (! (req.session && req.session.email && req.session.username && req.session.userid)) {
		res.status(409).end('Please login to register for events');
		return;
	}
	var role = new Roles(req.body);
	role.save(function (err) {
		if (err) {
			console.log(err);
			res.status(400).end();
		} else {
			res.json(role);
		}
	});
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
