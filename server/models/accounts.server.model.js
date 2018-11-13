/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
SALT_WORK_FACTOR = 10;

/* Create your schema */
var userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: { 
		type: String, 
		required: true
	},
	my_events: {
		type: Array,
		default: [],
	},
	created_at: Date,
	updated_at: Date
});

/* create a 'pre' function that adds the updated_at (and created_at if not already there) property */
userSchema.pre('save', function (next) {
	var user = this;
	var currentTime = new Date;
	this.updated_at = currentTime;
	if (!this.created_at) {
		this.created_at = currentTime;
	}
	next();
	 // only hash the password if it has been modified (or is new)
	 if (!user.isModified('password')) return next();

	 // generate a salt
	 bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		 if (err) return next(err);
 
		 // hash the password using our new salt
		 bcrypt.hash(user.password, salt, function(err, hash) {
			 if (err) return next(err);
 
			 // override the cleartext password with the hashed one
			 user.password = hash;
			 next();
		 });
	 });
});
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


/* Export the model to make it avaiable to other parts of your Node application */
module.exports = mongoose.model('User', userSchema);;
