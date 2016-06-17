var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var commentSchema = new Schema({
	rating: {
		type: Number,
		min: 1,
		max: 5,
		required: true
	},
	//link comment to User 
	comment: {
		type: String,
		required: true
	},
	postedBy: {
		type:mongoose.Schema.Types.ObjectId,
		ref:'User'
	}
},	{
	timestamps: true
});

var dishSchema = new Schema({
	name : {
		type: String,
		required: true,
		unique: true
	},
	image : {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	label: {
		type: String,
		required: true,
		default: ""
	},
	price: {
		type: Currency,
		required: true
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

