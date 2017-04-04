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

//exports.placeOrder = function(req,res){
	router.route('/placeorder')
		.post(function(req,res){
			console.log('arrived placeorder');
			
			order.amount = req.body.amount;
			order.location = req.body.location;
			order.status = req.body.status;
			order.message = req.body.message;
			for(var i = 0; i< req.body.items.length; i++)
			{							
				item.qty = req.body.items[i].qty;
				item.name = req.body.items[i].name;
				item.milk_type = req.body.items[i].milk_type;
				item.size = req.body.items[i].size;
				item.price =req.body.items[i].price;
				order_items.push(item);
			}				
			order.items = order_items;

			dbs.createOrder(order,function(result){
				console.log(result);
				res.send(result);
			});
	
			// console.log("order : ");
			// console.log(order);	
	});

	router.route('/updateorder')
		.put(function(req,res){
			console.log('arrived updateorder');
			var items = [];
			
			order.order_id = req.body.order_id;
			order.amount = req.body.amount;
			order.location = req.body.location;
			order.status = req.body.status;
			order.message = req.body.message;
			for(var i = 0; i< req.body.items.length; i++)
			{							
				item.qty = req.body.items[i].qty;
				item.name = req.body.items[i].name;
				item.milk_type = req.body.items[i].milk_type;
				item.size = req.body.items[i].size;
				item.price =req.body.items[i].price;
				order_items.push(item);
			}				
			order.items = order_items;

			dbs.updateOrder(order,function(result){
				console.log(result);
				res.send(result);
			});
	
			console.log("order : ");
			console.log(order);

		});

	router.route('/deleteorder')
		.delete(function(req,res){
			console.log('arrived deleteorder');
			
			var id = req.body.id;

			dbs.deleteOrder(id,function(result){
				console.log(result);
			
			});
		});	

	router.route('/vieworders')
		.get(function(req,res){

			console.log('Arrived in vieworders');

			dbs.viewOrders(function(result){
				console.log(result);
				res.send(result);
			});
		});	

module.exports = router;