var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var playerSchema = new Schema({
	'name' : String,
	'goalsScored' : Number,
	'yellowCards' : Number,
	'redCards' : Number
});

module.exports = mongoose.model('player', playerSchema);
