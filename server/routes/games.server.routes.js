var gameEvents = require('../models/events.server.model.js');
var express = require('express');
var router = express.Router();
 router.get('/search', function(req, res, next){
  var q = req.query.q;
   // gameEvents.find({
  //     $text: {
  //         $search: q
  //     }
  // }, {
  //   _id: 0,
  //   __v: 0
  // }, function(err,data){
  //   res.json(data);
  // });
   gameEvents.find({
    name: {
      $regex: new RegExp(q)
    }
  }, {
    _id: 0,
    __v: 0
  }, function(err, data){
    res.json(data);
  }).limit(20);
 });
 module.exports = router;
