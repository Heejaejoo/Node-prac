var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dishSchema = new Schema({
	name : {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String,
		required: true
	}
},//time stamp add two more filds, createdat/updatedat when saved
{
	timestamps:true
});
var Dishes = mongoose.model('Dish', dishSchema);
//mongoose create collection with the name Dishes(plural version of Dish)

module.exports = Dishes;

