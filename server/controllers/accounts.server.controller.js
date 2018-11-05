
/* Dependencies */
var mongoose = require('mongoose');
var Account = require('../models/accounts.server.model.js');

/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message. 
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions, refer back to this tutorial 
  from assignment 3 https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
*/


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

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function (req, res) {
	account.find({}).sort('username').exec(function(err, items) {
		res.json(items);
	});
};

/* 
   Middleware: find a listing by its ID, then pass it to the next request handler. 

   Find the listing using a mongoose query, 
   bind it to the request object as the property 'listing', 
   then finally call next
*/
exports.acctByID = function (req, res, next, id) {
	Listing.findById(id).exec(function (err, listing) {
		if (err) {
			res.status(400).send(err);
		} else {
			req.account = account;
			next();
		}
	});
};
