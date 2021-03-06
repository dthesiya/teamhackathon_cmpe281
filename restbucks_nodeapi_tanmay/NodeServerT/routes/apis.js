var express = require('express');
var router = express.Router();

var async = require('async');
var dbs = require('../database/db');
var  reply = require('../reply.js');


/*var item = {
				qty : {},
				name : {},
				milk_type : {},
				size : {},
				price : {},
			}
*/
/*var order = {
	 order_id : {},
	 amount : {},
	 location : {},
	 items : {},
	 status : {},
	 message : {}
}*/

/*var order_items = [];*/

var orderQueue = async.queue(function(id,callback){
	//console.log("Processing order :  " + id);
	//console.log("waiting to be processed" + orderQueue.length());
	//console.log('-----------------');

	setTimeout(function(){
		//console.log(id);
		dbs.updateStatus(id);
	},5000);

	setTimeout(function(){
		dbs.updateStatus(id);
	},25000);

	setTimeout(function(){
		dbs.updateStatus(id);
		callback();
	},35000);

},1);
// orderQueue.push('95334769-4fc1-4b9a-b582-ec4b97d6092c');
// orderQueue.push('589fb5c9-b854-49b1-b4b1-8beb99bd21ad');

	router.route('/order')

		// For placing an order
		// Order details are expected in Request body

		.post(function(req,res){

			//console.log('arrived in place order');
			var order = {};
			order.items = [];
			
			// Setting order variable from URL

			order.amount = req.body.amount;
			order.location = req.body.location;
			order.status = 'PLACED';

			for(var item of req.body.items) {							
				order.items.push(item);
			}				

						console.log('placed order : ');
						console.log(order);
			// Calling database function placeOrder

			dbs.placeOrder(order,function(result){

				res.send(result);
				res.end();
			});
		});

	router.route('/order/:id')

		// For getting a particular order
		// Order ID is parsed from URL

		.get(function(req,res){

			//console.log('Arrived in vieworder');

			var id = req.params.id;
			
			// Calling database function vieworders
			dbs.getOrderById(id,function(result){
				//console.log(result);
				res.send(result);
				res.end();
			});
		})

		// For updating an order
		// Order ID is parsed from URL

		.put(function(req,res){

			//console.log('arrived in Update');
			var order = {};
			order.items = [];
			
			// Setting order variable from URL

			order.order_id = req.params.id;
			var id = order.order_id;
			dbs.getOrderById(id,function(result){
				
				if(result.status == 404 || result.status == 400) {
					res.send(result);
					res.end();
				}
				else {
					if(result.order.status == 'PLACED') {
						order.amount = req.body.amount;
						order.location = req.body.location;
						order.status = 'PLACED';
				
						for(var item of req.body.items) {							
							order.items.push(item);
						}				
						//order.items = order_items;

						console.log('Updated order : ');
						console.log(order);
		
						// Calling database function placeOrder
			
						dbs.updateOrder(order,function(result){
						 	res.send(result);
							res.end();
						});
					}
					else {
						final_result = {};
						final_result.status = reply.error_status;
						final_result.err = "Cannot update order after payment";
						res.send(final_result);
						res.end();
					}
				}
			});
		})

		// For canceling an order 
		// Order ID Is parsed from URL

		.delete(function(req,res){

			var id = req.params.id;

			dbs.getOrderById(id,function(result){
				
				if(result.status == reply.error_status) {
					res.send(result);
					res.end();
				}
				else {
					if(result.order.status == 'PLACED') {
						//console.log('Deleting the order');
						dbs.cancelOrder(id,function(result){
						//console.log(result);
						res.send(result);
						res.end();
						});
					}else {
						final_result = {};
						final_result.status = reply.error_status;
						final_result.err = reply.message.err_calcelPaid;
						res.send(final_result);
						res.end();
					}
				}
			});
		});	

	// For getting list of orders

	router.route('/orders')
		.get(function(req,res){

			// Calling database function getOrders

			dbs.getOrders(function(result){
				//console.log(result);
				res.send(result);
				res.end();
			});
		});		

	router.route('/pay/:id')
		.post(function(req,res){

			var id = req.params.id;

			// Calling database function Payment
			dbs.getOrderById(id,function(result){
				
				if(result.status == 404 || result.status == 400){
					res.send(result);
					res.end();
				}
				else {
					if(result.order.status == 'PLACED') {
						//console.log('Making payment');
						dbs.pay(id,function(result){
							orderQueue.push(id);
							//console.log(result);
							res.send(result);
							res.end();
						});
					}
					else {
						final_result = {};
						final_result.status = reply.error_status;
						final_result.err = reply.message.err_paidAlready;
						res.send(final_result);
						res.end();
					}
				}
			});
		});	

module.exports = router;