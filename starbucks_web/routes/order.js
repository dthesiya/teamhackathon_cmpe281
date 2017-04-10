/**
 * Created by dthesiya on 4/4/17.
 */
var express = require('express');
var config = require('./config.json');
var http = require('http');
var request = require('sync-request');

var host = config.kong.host + ":" + config.kong.port;
var prices = config.coffee.prices;

exports.placeOrder = function (req, res, next) {
    var order = req.body.order;
    var amount = 0;
    for(var item of order.items){
        item.price = prices[item.size];
        amount += item.price * item.qty;
    }
    order.amount = amount;
    var url = host + config.kong.locations[order.location] + config.kong.apis.placeorder.url;
    var resp = request(config.kong.apis.placeorder.method, url, {
        json: order
    });
    var resp = JSON.parse(resp.getBody('utf8'));
    res.send({status : 200, data : resp}).end();
};

exports.updateOrder = function (req, res, next) {
    var orderId = req.params.orderId;
    var order = req.body.order;
    var amount = 0;
    for(var item of order.items){
        item.price = prices[item.size];
        amount += item.price * item.qty;
    }
    order.amount = amount;
    var url = host + config.kong.locations[order.location] + config.kong.apis.updateorder.url
        + "/" + orderId;
    var resp = request(config.kong.apis.updateorder.method, url, {
        json: order
    });
    var resp = JSON.parse(resp.getBody('utf8'));
    res.send({status : 200, data : resp}).end();
};

exports.orderDetails = function (req, res, next) {
    var orderId = req.params.orderId;
    var location = req.headers["location"];
    var url = host + config.kong.locations[location] + config.kong.apis.getorder.url
        + "/" + orderId;
    var resp = request(config.kong.apis.getorder.method, url);
    var resp = JSON.parse(resp.getBody('utf8'));
    res.send({status : 200, data : resp}).end();
};

exports.payOrder = function (req, res, next) {
    var orderId = req.params.orderId;
    var location = req.headers["location"];
    var url = host + config.kong.locations[location] + config.kong.apis.payorder.url
        + "/" + orderId;
    var resp = request(config.kong.apis.payorder.method, url);
    var resp = JSON.parse(resp.getBody('utf8'));
    res.send({status : 200, data : resp}).end();
};

exports.cancelOrder = function (req, res, next) {
    var orderId = req.params.orderId;
    var location = req.headers["location"];
    var url = host + config.kong.locations[location] + config.kong.apis.cancelorder.url
        + "/" + orderId;
    var resp = request(config.kong.apis.cancelorder.method, url);
    var resp = JSON.parse(resp.getBody('utf8'));
    res.send({status : 200, data : resp}).end();
};

exports.getAllOrders = function (req, res, next) {
    var orderId = req.params.orderId;
    var location = req.headers["location"];
    var url = host + config.kong.locations[location] + config.kong.apis.getallorders.url;
    var resp = request(config.kong.apis.getallorders.method, url);
    var resp = JSON.parse(resp.getBody('utf8'));
    res.send({status : 200, data : resp}).end();
};