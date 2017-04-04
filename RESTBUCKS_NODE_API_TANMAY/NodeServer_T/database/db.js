var cassandra = require('cassandra-driver');
var contactpoint = new cassandra.Client({contactPoints : ['127.0.0.2'], keyspace: 'restbucks'});
var uuid = cassandra.types.Uuid;
const querystring = require('querystring');


exports.createOrder = function(order,callback) {

	var id = uuid.random();
    // var query = "INSERT INTO restbucks_order (order_id, amount, location, status, message, items) VALUES ("+id+","+order.amount+",'"+order.location+"','"+order.status+"','"+order.message+"',"+order.items+")";
    var query = "INSERT INTO restbucks_order JSON ?" ;
    // var params= [id,order.amount,order.location,order.status,order.message,order.items]
   	order.order_id = id;
	contactpoint.execute(query,[JSON.stringify(order)],{ prepare: true },function(err,result){
		console.log("err " + err);
		if(err)
			callback("Can not insert order");
		else
			callback(result);
	});
};

exports.updateOrder = function(order,callback) {
	 var query = "INSERT INTO restbucks_order JSON ?" ;
    // var params= [id,order.amount,order.location,order.status,order.message,order.items]
	contactpoint.execute(query,[JSON.stringify(order)],{ prepare: true },function(err,result){
		if(err)
			callback("Can update order");
		else
			callback(result);
	});
};

exports.deleteOrder = function(id,callback){
	var query = "DELETE FROM restbucks_order WHERE order_id = "+id+""; 
	contactpoint.execute(query,function(err,result){
		if(err)
			callback("Can delete order");
		else
			callback(result);
	});
};

exports.viewOrders = function(callback){
	var query = "SELECT * FROM 	restbucks_order";
	contactpoint.execute(query,function(err,result){
		if(err)
			callback("Can not get orders");
		else
			callback(result);
	});
};