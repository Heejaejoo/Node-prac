var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favoriteSchema = new Schema({
	postedBy :{
		type: mongoose.Schema.Types.ObjectId,
		ref:'User'
		},
	dishes: [{
		type:mongoose.Schema.Types.ObjectId,
		ref:'Dish'
	}]
},//time stamp add two more filds, createdat/updatedat when saved
{
	timestamps:true
});
module.exports = mongoose.model('Favorite', favoriteSchema);