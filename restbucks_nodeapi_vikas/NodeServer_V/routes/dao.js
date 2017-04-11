/**
 * Created by vicky on 4/3/2017.
 */
const cassandra = require('cassandra-driver');
const uuid = cassandra.types.Uuid;
const config = require('./config');
const client = new cassandra.Client({contactPoints:[config.cassandra.contactPoints1,config.cassandra.contactPoints2],keyspace: config.cassandra.keyspace });


exports.client = client;
exports.uuid = uuid;
