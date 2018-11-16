var roles = require('../controllers/roles.server.controller.js');
var express = require('express');
var router = express.Router();

router.route('/').get(roles.list).post(roles.create);

router.route('/:roleId').get(roles.read).put(roles.update).delete(roles.delete);

router.param('roleId', roles.roleByID);
module.exports = router;
