var cassandra = require('cassandra-driver');
var contactpoint = new cassandra.Client({contactPoints : ['127.0.0.2'], keyspace: 'restbucks'});
var uuid = cassandra.types.Uuid;
const querystring = require('querystring');

exports.placeOrder = function(order,callback) {

	var id = uuid.random();
    // var query = "INSERT INTO restbucks_order (order_id, amount, location, status, message, items) VALUES ("+id+","+order.amount+",'"+order.location+"','"+order.status+"','"+order.message+"',"+order.items+")";
    var query = "INSERT INTO restbucks_order JSON ?" ;
    // var params= [id,order.amount,order.location,order.status,order.message,order.items]
   	order.order_id = id;
	contactpoint.execute(query,[JSON.stringify(order)],{ prepare: true },function(err,result){
		response = {};
		
		if(err){
			response.status = 400;
			response.message = "Error occured when creating order";
			response.error = err;
		}
		else {
			response.status = 200;
			response.id = result.id;
			response.message = "Order Placed";
			response.stack = result;
		}
		callback(response);
	});
};

exports.updateOrder = function(order,callback) {

    // var query = "INSERT INTO restbucks_order (order_id, amount, location, status, message, items) VALUES ("+id+","+order.amount+",'"+order.location+"','"+order.status+"','"+order.message+"',"+order.items+")";
    var query = "INSERT INTO restbucks_order JSON ?" ;
    // var params= [id,order.amount,order.location,order.status,order.message,order.items]
	contactpoint.execute(query,[JSON.stringify(order)],{ prepare: true },function(err,result){
		response = {};
		if(err){
			response.status = 400;
			response.message = "Error occured when updating order";
			response.error = err;
			console.log(err);
		}
		else {
			response.status = 200;
			response.id = result.id;
			response.message = "Order Updated";
			response.stack = result;
		}
		callback(response);
	});
};

exports.cancelOrder = function(id,callback){
	var query = "DELETE FROM restbucks_order WHERE order_id = "+id+""; 
	contactpoint.execute(query,function(err,result){
		response = {};
		if(err){
			response.status = 400;
			response.message = "Error occured when deleting a order";
			response.error = err;
		}
		else{
			response.status = 200;
			response.id = id;
			response.message = result;
		}
		callback(response);	
	});
};

exports.getOrders = function(callback){
	var query = "SELECT * FROM 	restbucks_order";
	contactpoint.execute(query,function(err,result){
		response = {};
		if(err){
			response.status = 400;
			response.message = "Error occured when Getting a orders";
			response.error = err;
		}
		else{
			response.status = 200;
			response.message = "List of Orders";
			response.orders = result.rows;
			response.stack = result;
		}
		callback(response);
	});
};

exports.getOrderById = function(id,callback){
	var query = "SELECT * FROM 	restbucks_order WHERE order_id = "+id+"";
	contactpoint.execute(query,function(err,result){
		response = {};
		if(err){
			console.log('error occured');
			response.status = 400;
			response.message = "Error occured when Getting a orders";
			response.error = err;
		}
		else if (result.rows.length == 0) {

			console.log('zero rows');
			response.status = 404;
			response.message = "No order found with requested ID";
			response.stack = result;
		}
		else {
			//console.log('Sending results');
			response.status = 200;
			response.message = "List of Orders";
			response.orders = result.rows;
			response.stack = result;
		}
		callback(response);
	});
};

exports.pay = function(id,callback){
	var query = "UPDATE restbucks_order SET status = 'PAID' WHERE order_id = "+id+"";
	contactpoint.execute(query,function(err,result){
		response = {};
		if(err){
			response.status = 400;
			response.message = "Error occured when making a payment";
			response.error = err;
		}
		else{
			response.status = 200;
			response.id = id;
			response.message = "Payment Successful";
			response.stack = result;
		}
		callback(response);
	}); 
};

exports.updateStatus = function(id,status){
	var query = "UPDATE restbucks_order SET status = '"+status+"' WHERE order_id = "+id+"";
	console.log(query);
	
	var get_query = "SELECT status FROM restbucks_order WHERE order_id="+id+"";
	contactpoint.execute(get_query,function(err,result){
		if(err)
		{
			console.log('Error occured when getting the status');
			console.log(err);		
		}
		else
		{
			console.log(result);
			contactpoint.execute(query,function(err,result){
				if(err){
					console.log('Error occured when updating status');
					console.log(err);
				}
				else{
					console.log('status updated to : ' + status + 'for ID : ' + id);
					console.log(result);
				}
			});
		}
	});	 
};