/**
 * Created by vicky on 4/3/2017.
 */
const cassandra = require('cassandra-driver');
const uuid = cassandra.types.Uuid;
const config = require('./config');
const client = new cassandra.Client({contactPoints:[config.cassandra.contactPoints],keyspace: config.cassandra.keyspace });

/*
module.exports = client;
module.exports = uuid;
*/

exports.client = client;
exports.uuid = uuid;

/*
exports.insert = function (query) {
    console.log(config.cassandra.contactPoints);

};

exports.update = function (query) {
    console.log(config.cassandra.contactPoints);

};

exports.delete = function (query) {
    console.log(config.cassandra.contactPoints);

};



*/
