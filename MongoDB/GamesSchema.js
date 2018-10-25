/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/* Create your schema */
var gamesSchema = new Schema({
  /* your code here */
  name: {type: String, required: true},
  category: {type: String, required: true},
  platform: {type: String, required: true},
  Description: {type: String, required: true},
  created_at: Date,
  updated_at: Date
});

/* create a 'pre' function that adds the updated_at (and created_at if not already there) property */
gamesSchema.pre('save', function(next) {
  /* your code here */
  var currentDate = new Date();
  this.updated_at = currentDate;

  if(!this.created_at)
    this.created_at = currentDate;

  next();
});

/* Use your schema to instantiate a Mongoose model */
var Games = mongoose.model('Games', gamesSchema);

/* Export the model to make it avaiable to other parts of your Node application */
module.exports = Games;
