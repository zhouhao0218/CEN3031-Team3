
/* Dependencies */
var mongoose = require('mongoose');
var Games = require('../models/games.server.model.js');

/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message.
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions, refer back to this tutorial
  from assignment 3 https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
*/

/* Create a listing */
exports.create = function (req, res) {
	/* Instantiate a Listing */
	var game = new Games(req.body);

	/* Then save the listing */
	game.save(function (err) {
		if (err) {
			console.log(err);
			res.status(400).send(err);
		} else {
			res.json(game);
		}
	});
};

/* Show the current listing */
exports.read = function (req, res) {
	/* send back the listing as json from the request */
	res.json(req.listing);
};

/* Update a listing */
exports.update = function (req, res) {
	var game = req.listing;
	if (req.body.name) {
		game.name = req.body.name;
	}
	if(req.body.category){
		game.category = req.body.category;
	}
	if (req.body.platform) {
		game.platform.platform;
	}
	if (req.body.description){
		game.description = req.body.description;
	}
	listing.save(function(err, what) {
		if (err) {
			res.status(400).send(err);
		} else {
			res.json(what);
		}
	});
};

/* Delete a listing */
exports.delete = function (req, res) {
	var game = req.listing;
	game.remove(function(err) {
		if (err) {
			res.status(400).send(err);
		} else {
			res.send('');
		}
	});
};

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function (req, res) {
	Games.find({}).sort('name').exec(function(err, items) {
		res.json(items);
	});
};

/*
   Middleware: find a listing by its ID, then pass it to the next request handler.

   Find the listing using a mongoose query,
   bind it to the request object as the property 'listing',
   then finally call next
*/
exports.listingByID = function (req, res, next, id) {
	Games.findById(id).exec(function (err, game) {
		if (err) {
			res.status(400).send(err);
		} else {
			req.listing = game;
			next();
		}
	});
};
