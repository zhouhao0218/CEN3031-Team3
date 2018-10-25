'use strict';
/*
  Import modules/files you may need to correctly run the script.
  Make sure to save your DB's uri in the config file, then import it with a require statement!
 */
var fs = require('fs'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Games = require('./GamesSchema.js'),
    config = require('./config');

/* Connect to your database */
mongoose.connect(config.db.uri);
/*
  Instantiate a mongoose model for each listing object in the JSON file,
  and then save it to your Mongo database
 */
fs.readFile('games.json','utf8',function(err,data){
    JSON.parse(data).entries.forEach(function(games){
      var game = new Games({
        name: games.name,
        category: games.category,
		platform: games.platform,
		Description: games.Description
      });
      game.save(function(err){
        if(err) throw err;
      });
    });
});

