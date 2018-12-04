var events = require('../controllers/events.server.controller.js');
var express = require('express');
var router = express.Router();

/*
	These method calls are responsible for routing requests to the correct request handler.
	Take note that it is possible for different controller functions to handle requests to the same route.
*/
router.route('/').get(events.list).post(events.create);


/*
	The ':' specifies a URL parameter. 
*/
router.route('/:eventId').get(events.read).put(events.update).delete(events.delete);

router.route('/roles/:eventId').get(events.rolesPerEvent);

router.param('eventId', events.eventByID);
module.exports = router;
