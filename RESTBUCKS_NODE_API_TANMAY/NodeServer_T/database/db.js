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
		console.log("err " + err);
		if(err){
			response.status = 400;
			response.message = "Error occured when creating order";
			response.error = err;
			callback(response);
		}
		else {
			response.status = 200;
			response.id = result.id;
			response.message = "Order Placed";
			callback(response);
		}
	});
};

exports.updateOrder = function(order,callback) {
	 var query = "INSERT INTO restbucks_order JSON ?" ;
    // var params= [id,order.amount,order.location,order.status,order.message,order.items]
	contactpoint.execute(query,[JSON.stringify(order)],{ prepare: true },function(err,result){
		response = {};
		if(err) {
			response.status = 400;
			response.message = "Error occured when updating a order";
			response.error = err;
			callback(response);
		}
		else
			response.status = 200;
			response.id = result.id;
			response.message = "Order Updated";
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
			callback(response);
		}
		else{
			response.status = 200;
			response.id = id;
			response.message = result;
			callback(response);
		}
			
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
			callback(response);
		}
		else{
			response.status = 200;
			response.message = "List of Orders";
			response.orders = result.rows;
			callback(response);
		}
	});
};

exports.getOrderById = function(id,callback){
	var query = "SELECT * FROM 	restbucks_order WHERE order_id = "+id+"";
	contactpoint.execute(query,function(err,result){
		response = {};
		if(err){
			response.status = 400;
			response.message = "Error occured when Getting a orders";
			response.error = err;
			callback(response);
		}
		else{
			response.status = 200;
			response.message = "List of Orders";
			response.orders = result.rows;
			callback(response);
		}
	});
};