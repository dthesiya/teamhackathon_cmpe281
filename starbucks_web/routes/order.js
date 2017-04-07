/**
 * Created by dthesiya on 4/4/17.
 */
var express = require('express');

exports.placeOrder = function (req, res, next) {
    global.order = req.body.order;
    res.send({status:200});
};

exports.updateOrder = function (req, res, next) {
    console.log(req.params.orderId);
    global.order = req.body.order;
    res.send({status:200});
};

exports.orderDetails = function (req, res, next) {
    global.order.id = 1234;
    res.json(JSON.stringify(global.order));
};

exports.payOrder = function (req, res, next) {
    console.log(req.params.orderId);
    res.send({status:200});
};

exports.cancelOrder = function (req, res, next) {
    console.log(req.params.orderId);
    res.send({status:200});
};

exports.getAllOrders = function (req, res, next) {
    res.json(JSON.stringify([global.order]));
};

exports.pay = function (req, res, next) {
    res.json(JSON.stringify(global.order));
};