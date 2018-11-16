var express = require('express');
var router = express.Router();
var Roles = require('../models/roles.server.model.js');

var amiloggedin = function(req) {
	return req.session && req.session.email && req.session.username && req.session.userid;
};

router.route('/username').get(function(req, res) {
	if (amiloggedin(req)) {
		res.status(200).end(req.session.username);
	} else {
		res.status(400).end();
	}
});

router.route('/id').get(function(req, res) {
	if (amiloggedin(req)) {
		res.status(200).end(req.session.userid);
	} else {
		res.status(400).end();
	}
});

router.route('/email').get(function(req, res) {
	if (amiloggedin(req)) {
		res.status(200).end(req.session.email);
	} else {
		res.status(400).end();
	}
});

router.route('/events').get(function(req, res) {
	if (amiloggedin(req)) {
		Roles.find({ user: req.session.userid }, function(err, records) {
			if (err) {
				res.status(400).end();
			} else {
				res.json(records);
			}
		});
	} else {
		res.status(400).end();
	}
});

module.exports = router;
