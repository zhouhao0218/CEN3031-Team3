var accounts = require('../controllers/accounts.server.controller.js');
var express = require('express');
var router = express.Router();

router.route('/').get(accounts.list).post(accounts.create).put(accounts.login);

// The ':' specifies a URL parameter. 

router.route('/:accountId').get(accounts.read).put(accounts.update).delete(accounts.delete);

router.param('accountId', accounts.accountsByID);
module.exports = router;
