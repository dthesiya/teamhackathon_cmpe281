var cassandra = require('cassandra-driver');
var contactpoint = new cassandra.Client({contactPoints : ['192.168.99.100'], keyspace: 'restbucks'});
var uuid = cassandra.types.Uuid;
var  reply = require('../reply.js');
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
			response.status = reply.error_status;
			response.message = reply.message.err_place;
		}
		else {
			response.status = reply.success_status;
			response.id = id;
			//response.stack = result;
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
			response.status = reply.error_status;
			response.message = "Error occured when updating order";
			response.error = err;
			console.log(err);
		}
		else {
			response.status = reply.success_status;
			response.id = result.id;
			//response.stack = result;
		}
		callback(response);
	});
};

exports.cancelOrder = function(id,callback){
	var query = "DELETE FROM restbucks_order WHERE order_id = "+id+""; 
	contactpoint.execute(query,function(err,result){
		response = {};
		if(err){
			response.status = reply.error_status;
			response.message = reply.message.err_cancel;
			response.error = err;
		}
		else{
			response.status = reply.success_status;
			response.id = id;
		}
		callback(response);	
	});
};

exports.getOrders = function(callback){
	var query = "SELECT * FROM 	restbucks_order";
	contactpoint.execute(query,function(err,result){
		response = {};
		if(err){
			response.status = reply.error_status;
			response.message = reply.message.err_getOrders;
		}
		else{
			response.status = reply.success_status;
			response.orders = result.rows;
			//response.stack = result;
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
			response.status = reply.error_status;
			response.message = reply.message.err_getOrderById;
		}
		else if (result.rows.length == 0) {

			console.log('zero rows');
			response.status = reply.error_status;
			response.message = reply.message.err_getOrderById;
			//response.stack = result;
		}
		else {
			//console.log('Sending results');
			response.status = reply.success_status;
			response.orders = result.rows[0];
			//response.stack = result;
		}
		callback(response);
	});
};

exports.pay = function(id,callback){
	var query = "UPDATE restbucks_order SET status = 'PAID' WHERE order_id = "+id+"";
	contactpoint.execute(query,function(err,result){
		response = {};
		if(err){
			response.status = reply.error_status;
			response.message = reply.message.err_pay;
			}
		else{
			response.status = reply.success_status;
			response.id = id;
			//response.stack = result;
		}
		callback(response);
	}); 
};

exports.updateStatus = function(id){
	
	var get_query = "SELECT status FROM restbucks_order WHERE order_id="+id+"";
	contactpoint.execute(get_query,function(err,result){
		var status = '';
		if(err)
		{
			console.log('Error occured when getting the status');
			console.log(err);		
		}
		else
		{
			console.log('result is : ');
			console.log(result.rows[0].status);
			if(result.rows[0].status == 'PAID'){	
				status = 'PREPARING';
				console.log('status is : ' + status);
			}
			else if(result.rows[0].status == 'PREPARING'){
				status = 'SERVED';
				console.log('status is : ' + status);
			}
			else if(result.rows[0].status == 'SERVED'){
				status = 'COLLECTED';
				console.log('status is : ' + status);
			}
			console.log('finally status is : ' + status);	
			var query = "UPDATE restbucks_order SET status = '"+status+"' WHERE order_id = "+id+"";
			console.log(query);
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