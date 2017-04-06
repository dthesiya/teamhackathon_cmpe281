var express = require('express');
var router = express.Router();

var dbs = require('../database/db');

var item = {
				qty : {},
				name : {},
				milk_type : {},
				size : {},
				price : {},
			}

var order = {
	 order_id : {},
	 amount : {},
	 location : {},
	 items : {},
	 status : {},
	 message : {}
}

var order_items = [];

	// For placing an order
	// Order details are expected in Request body

	router.route('/place')
		.post(function(req,res){

			console.log('arrived place');
			
			// Setting order variable from URL

			order.amount = req.body.amount;
			order.location = req.body.location;
			order.status = req.body.status;
			order.message = req.body.message;

			for(var item of req.body.items) {							
				order_items.push(item);
			}				
			order.items = order_items;

			// Calling database function placeOrder

			dbs.placeOrder(order,function(result){
				res.send(result);
			});
	});

	// For updating an order
	// Order ID is parsed from URL

	router.route('/update/:id')
		.put(function(req,res){
			console.log('arrived update');
			var items = [];
			
			// Setting order variable from URL

			order.order_id = req.params.id;
			order.amount = req.body.amount;
			order.location = req.body.location;
			order.status = req.body.status;
			order.message = req.body.message;

			for(var item of req.body.items) {							
				order_items.push(item);
			}

			order.items = order_items;

			//Calling database function placeOrder
 
			dbs.updateOrder(order,function(result){
				console.log("result is : " )
				console.log(result);
				res.send(result);
			});
	
			console.log("order : ");
			console.log(order);

		});

	// For canceling an order 
	// Order ID Is parsed from URL

	router.route('/cancel/:id')
		.delete(function(req,res){
			console.log('arrived cancel order');
			
			var id = req.params.id;

			dbs.cancelOrder(id,function(result){
				console.log(result);
				res.send(result);
			
			});
		});	

	// For getting list of orders

	router.route('/orders')
		.get(function(req,res){

			console.log('Arrived in orders');

			dbs.getOrders(function(result){
				console.log(result);
				res.send(result);
			});
		});		

	// For getting a particular order
	// Order ID is parsed from URL

	router.route('/order/:id')
		.get(function(req,res){

			console.log('Arrived in vieworders');

			var id = req.params.id;
			
			dbs.getOrderById(id,function(result){
				console.log(result);
				res.send(result);
			});
		});	

module.exports = router;