
var mongoose = require('mongoose');
var Account = require('../models/accounts.server.model.js');

exports.create = function (req, res) {
	/* Instantiate a Listing */
	var account = new Account(req.body);

	/* Then save the listing */
	account.save(function (err) {
		if (err) {
			console.log(err);
			res.status(400).send(err);
		} else {
			res.json(account);
		}
	});
};

exports.login = function(req, res) {
	res.json(req.body);
};

/* Show the current listing */
exports.read = function (req, res) {
	/* send back the listing as json from the request */
	res.json(req.account);
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
