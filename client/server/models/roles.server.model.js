/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

/* Create your schema */
var rolesSchema = new Schema({
	user: {
		type: ObjectId,
		required: true,
	},
	event: {
		type: ObjectId,
		required: true,
	},
	host: {
		type: Boolean,
		required: true,
	},
	created_at: Date,
	updated_at: Date
});

/* create a 'pre' function that adds the updated_at (and created_at if not already there) property */
rolesSchema.pre('save', function (next) {
	var currentTime = new Date;
	this.updated_at = currentTime;
	if (!this.created_at) {
		this.created_at = currentTime;
	}
	next();
});

/* Use your schema to instantiate a Mongoose model */
var Role = mongoose.model('Role', rolesSchema);

/* Export the model to make it avaiable to other parts of your Node application */
module.exports = Role;;
