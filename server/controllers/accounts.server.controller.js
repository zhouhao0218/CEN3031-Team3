
var mongoose = require('mongoose');
var Account = require('../models/accounts.server.model.js');

exports.create = function (req, res) {
	/* Instantiate a Listing */
	var account = new Account(req.body);

	/* Then save the listing */
	account.save(function (err) {
		if (err) {
			if (err.code == 11000) {
				res.status(409).end('Username or email already in use');
			} else {
				console.log(err);
				res.status(400).send(err);
			}
		} else {
			req.session.email = account.email;
			req.session.username = account.username;
			req.session.userid = account._id;
			res.status(200).end();
		}
	});
};

exports.login = function(req, res) {
	if (! (req.body && req.body.email && req.body.password)) {
		res.status(400).end();
		return;
	}
	var q = {
		email : req.body.email,
		password : req.body.password,
	};
	Account.find(q).exec(function(err, items) {
		if (err) {
			console.log(err);
			res.status(400).end();
		} else if (items.length == 1) {
			req.session.email = items[0].email;
			req.session.username = items[0].username;
			req.session.userid = items[0]._id;
			res.status(200).end();
		} else {
			res.status(409).end('Bad email or password');
		}
	});
};

/* Show the current listing */
exports.read = function (req, res) {
	if (req.account) {
		res.status(200).end(req.account.username);
	} else {
		res.status(400).end();
	}
};

/* Update a listing */
exports.update = function (req, res) {
	var account = req.account;
	if (req.body.name) {
		account.username = req.body.username;
	}
	if (req.body.email) {
		account.email = req.body.email;
	}
	if (req.body.password) {
		account.password = req.body.password;
	}
	account.save(function(err, what) {
		if (err) {
			res.status(400).send(err);
		} else {
			res.json(what);
		}
	});
};

/* Delete a listing */
exports.delete = function (req, res) {
	var account = req.account;
	account.remove(function(err) {
		if (err) {
			res.status(400).send(err);
		} else {
			res.send('');
		}
	});
};

exports.list = function (req, res) {
	Account.find({}).exec(function(err, items) {
		res.json(items);
	});
};

/* 
   Middleware: find a listing by its ID, then pass it to the next request handler. 

   Find the listing using a mongoose query, 
   bind it to the request object as the property 'listing', 
   then finally call next
*/
exports.accountsByID = function (req, res, next, id) {
	Account.findById(id).exec(function (err, account) {
		if (err) {
			res.status(400).send(err);
		} else {
			req.account = account;
			next();
		}
	});
};
