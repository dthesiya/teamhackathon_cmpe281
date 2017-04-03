

var cassandra = require('cassandra-driver');
var uuid = cassandra.types.Uuid;
var client = new cassandra.Client({contactPoints:['127.0.0.1'],keyspace: 'poc_ks' });
exports.callme = function () {
    var id = uuid.random();
    var query = "INSERT INTO starbucks_order (order_id, amount, location, status, message, items) VALUES("+id+",12.99, 'San Jose','ordered','no message',[{qty:1,name:'cappocinu',milk_type:'low_fat',size:'medium',price:12.99}])";
    client.execute(query, function(err, result) {
        console.log(err);
        console.log(result);
    });
}

