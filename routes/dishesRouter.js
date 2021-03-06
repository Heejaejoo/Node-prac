var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Dishes = require('../models/dishes');
var Verify = require('./verify');

var dishRouter = express.Router();
dishRouter.use(bodyParser.json());
//parsing the body and convert to JSON
dishRouter.route('/')
	.all(Verify.verifyOrdinaryUser)
	.get(function(req,res,next){
		//neeeds to populate
		Dishes.find({})
		.populate('comments.postedBy')
		.exec(function(err, dish) {
			//takes 1st parameter as error
			//dish = array of dishes
			if(err) throw err;
			res.json(dish);
			//not even set headers, just one line is ok 
		});
	})
	.post(Verify.verifyAdmin, function(req,res,next){
		Dishes.create(req.body, function(err, dish) {
			if(err) return next(err);
			console.log('Dish created!');
			var id = dish._id;
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.end('Added the dish with id: ' + id);
		})
	})
	.delete(Verify.verifyAdmin, function(req,res,next){
		//collection becomes empty
		Dishes.remove({}, function(err, resp) {
			if(err) throw err;
			//resp : how many dishes are deleted
			res.json(resp);
		});
	});


dishRouter.route('/:dishId')
	.all(Verify.verifyOrdinaryUser)
	.get(function(req,res,next){
		Dishes.findById(req.params.dishId)
		.populate('comments.postedBy')
		.exec(function(err, dish) {
			if(err) throw err;
			res.json(dish);
		});
	})
	.put(Verify.verifyAdmin, function(req,res,next){
		Dishes.findByIdAndUpdate(req.params.dishId, {
			$set: req.body
		}, {
			new: true
				//return updated dish value
		}, function(err, dish) {
			if(err) throw err;
			res.json(dish);
		});
	})
	.delete(Verify.verifyAdmin, function(req,res,next){
		Dishes.findByIdAndRemove(req.params.dishId, function(err, resp){
			if(err) throw err;
			res.json(resp);
		});
	});

dishRouter.route('/:dishId/comments')
	.all(Verify.verifyOrdinaryUser)
	.get(function(req,res,next){
		Dishes.findById(req.params.dishId)
		.populate('comments.postedBy') 
		.exec(function(err, dish){
			if(err) throw err;
			res.json(dish.comments);
		});
	})
	.post(function(req, res, next){
		Dishes.findById(req.params.dishId, function(err, dish){
			if(err) throw err;
			req.body.postedBy = req.decoded._doc._id;
			dish.comments.push(req.body);
			dish.save(function (err, dish){
				if(err) throw err;
				console.log('Updated Comments!');
				res.json(dish);
			});
		});
	})
	.delete(Verify.verifyAdmin, function(req, res,next){
		Dishes.findById(req.params.dishId, function(err, dish){
			if(err) throw err;
			for(var i = 0; i<dish.comments.length; i++){
				dish.comments.id(dish.comments[i]._id).remove();
			}
			dish.save(function (err, result) {
				if(err) throw err;
				res.writeHead(200, {'Content-type': 'text/plain'});
				res.end('Deleted all comments!');
			});
		});
	});

dishRouter.route('/:dishId/comments/:commentId')
	.all(Verify.verifyOrdinaryUser)
	.get(function(req,res,next){
		Dishes.findById(req.params.dishId)
		.populate('comments.postedBy')
		.exec(function(err, dish){
			if(err) throw err;
			res.json(dish.comments.id(req.params.commentId));
		});
	})
	.put(function(req, res,next){
		Dishes.findById(req.params.dishId, function(err, dish){
			if(err) throw err;

			dish.comments.id(req.params.commentId).remove();
			req.body.postedBy = req.decoded._doc._id;
			dish.comments.push(req.body);
			
			dish.save(function (err, dish) {
				if(err) throw err;
				console.log('Updated Commets!');
				res.json(dish);
			});
		});
	})
	.delete(Verify.verifyAdmin, function(req, res, next){
		Dishes.findById(req.params.dishId, function(err,dish){
			if(dish.comments.id(req.params.commentId).postedBy != req.decoded._doc._id){
				var err = new Error('You are not authorized to perform this operation');
				err.status = 403;
				return next(err);	
			}
			dish.comments.id(req.params.commentId).remove();
			dish.save(function (err, resp) {
				if(err) throw err;
				res.json(resp);
			});
		});
	});

module.exports = dishRouter;
