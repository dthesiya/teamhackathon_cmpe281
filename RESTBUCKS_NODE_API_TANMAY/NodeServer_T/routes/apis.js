var express = require('express');
var router = express.Router();

//exports.placeOrder = function(req,res){
	router.route('/placeorder')
		.post(function(req,res){
			console.log('arrived here');
			var order_item = [];
			var item = {
				qty : {},
				name : {},
				milk_type : {},
				size : {},
				price : {},
			}
			var order = {
				 id : {},
				 amount : {},
				 location : {},
				 order_item : {}
			}
			order.id = req.body.id;
			order.amount = req.body.amount;
			order.location = req.body.location;

			for(var i = 0; i< req.body.order_item.length; i++)
			{							
				item.qty = req.body.order_item[i].qty;
				item.name = req.body.order_item[i].name;
				item.milk_type = req.body.order_item[i].milk_type;
				item.size = req.body.order_item[i].size;
				item.price =req.body.order_item[i].price;
				order_item.push(item);
			}				
			order.order_item = order_item;
	
			console.log("order : ");
			console.log(order);	

			res.send('inserted 1');
	});

	router.route('/updateorder')
		.put(function(req,res){
			console.log('arrived here');
			var order_item = [];
			var item = {
				qty : {},
				name : {},
				milk_type : {},
				size : {},
				price : {},
			}
			var order = {
				 id : {},
				 amount : {},
				 location : {},
				 order_item : {}
			}
			order.id = req.body.id;
			order.amount = req.body.amount;
			order.location = req.body.location;

			for(var i = 0; i< req.body.order_item.length; i++)
			{							
				item.qty = req.body.order_item[i].qty;
				item.name = req.body.order_item[i].name;
				item.milk_type = req.body.order_item[i].milk_type;
				item.size = req.body.order_item[i].size;
				item.price =req.body.order_item[i].price;
				order_item.push(item);
			}				
			order.order_item = order_item;
	
			console.log("order : ");
			console.log(order);	

			res.send('inserted 1');
		});

	router.route('/deleteorder')
		.delete(function(req,res){
			console.log('arrived here');
			var order_item = [];
			var item = {
				qty : {},
				name : {},
				milk_type : {},
				size : {},
				price : {},
			}
			var order = {
				 id : {},
				 amount : {},
				 location : {},
				 order_item : {}
			}
			order.id = req.body.id;
			order.amount = req.body.amount;
			order.location = req.body.location;

			for(var i = 0; i< req.body.order_item.length; i++)
			{							
				item.qty = req.body.order_item[i].qty;
				item.name = req.body.order_item[i].name;
				item.milk_type = req.body.order_item[i].milk_type;
				item.size = req.body.order_item[i].size;
				item.price =req.body.order_item[i].price;
				order_item.push(item);
			}			
			order.order_item = order_item;
	
			console.log("order : ");
			console.log(order);	

			res.send('deleted 1');
		});		

module.exports = router;