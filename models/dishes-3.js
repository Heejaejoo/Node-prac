var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	rating: {
		type: Number,
		min: 1,
		max: 5,
		required: true
	},
	comment: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	}
},{
	timestamps: true
});

var dishSchema = new Schema({
	name : {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String,
		required: true
	},
	comments:[commentSchema]//array of comments object
},//time stamp add two more filds, createdat/updatedat when saved
{
	timestamps:true
});
var Dishes = mongoose.model('Dish', dishSchema);
//mongoose create collection with the name Dishes(plural version of Dish)

module.exports = Dishes;

