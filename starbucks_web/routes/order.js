/**
 * Created by dthesiya on 4/4/17.
 */
var express = require('express');
global.orders = [];

exports.placeOrder = function (req, res, next) {
    var order = req.body.order;
    order.id = 1234;
    order.status = "PLACED";
    global.order = order;
    global.orders.push(order);
    res.send({status : 200, orderId : 1234});
};

exports.updateOrder = function (req, res, next) {
    global.order = req.body.order;
    res.send({status : 200});
};

exports.orderDetails = function (req, res, next) {
    res.json(JSON.stringify(global.order));
};

exports.payOrder = function (req, res, next) {
    res.send({status : 200});
};

exports.cancelOrder = function (req, res, next) {
    res.send({status:200});
};

exports.getAllOrders = function (req, res, next) {
    var city = req.headers["city"];
    var list = [];
    console.log(city);
    for(var i = 0; i < global.orders.length; i++){
        var ordr = global.orders[i];
        console.log(ordr.location+" "+city);
        if(ordr.location === city){
            list.push(ordr);
        }
    }
    res.json(JSON.stringify(list));
};

exports.pay = function (req, res, next) {
    res.json(JSON.stringify(global.order));
};