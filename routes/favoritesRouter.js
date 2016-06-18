var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Dishes = require('../models/dishes');
var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
	.all(Verify.verifyOrdinaryUser)
	.get(function(req, res, next){
		Favorites.find({})
			.populate('postedBy')
			.populate('dishes')
			.exec(function(err, favorite){
				if(err) throw err;
				res.json(favorite);
			});
	})
	.post(function(req, res, next){
		Favorites.findOne({postedBy: req.decoded._doc._id}, function(err, favorite){
			if(err) throw err;
			if(favorite === null){
				Favorites.create({postedBy:req.decoded._doc._id, dishes:[req.body._id]}, function(err, favorite){
					if(err) return next(err);
					console.log('Favorite Created!');
					res.json(favorite);
				});
			}else {
				favorite.dishes.push(req.body._id);
				favorite.save(function(err, favorite){
					if(err) throw err;
					console.log('Updated Favorites!!');
					res.json(favorite);
				});
			}
		});
	})
	.delete(Verify.verifyAdmin, function(req, res, next){
		Favorites.remove({}, function(err, resp){
			if(err) return next(err);
			res.json(resp);
		});
	});
favoriteRouter.route('/:dishid')
	.all(Verify.verifyOrdinaryUser)
	.delete(function(req, res, next){
		Favorites.findOne({postedBy: req.decoded._doc._id}, function(err, favorite){
			if(err) throw err;
			for(var i=0; i<favorite.dishes.length; i+=1){
				if(favorite.dishes[i] == req.params.dishid)
				{
					favorite.dishes.splice(i,1);
				}
			}
			favorite.save(function(err, favorite){
				if(err) throw err;
				console.log("Dish deleted");
				res.json(favorite);
			});
		});
	});

module.exports = favoriteRouter;
