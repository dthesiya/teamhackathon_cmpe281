/**
 * Created by vicky on 4/3/2017.
 */

var express = require('express');
var dao = require('./dao');
const config = require('./config');
var queue = require('block-queue');
var async = require('async');

var q = queue(1, function (id, done) {
    async.series([
            function(callback) {
                setTimeout(function () {
                    dao.client.execute(config.queries.update_status,[config.orderStatus.preparing, id], {prepare: true}, function (err, result) {
                        callback(null, 'one');
                    });
                }, 5000);

            },
            function(callback) {
                // do some more stuff ...
                setTimeout(function () {
                    dao.client.execute(config.queries.update_status, [config.orderStatus.served, id], {prepare: true}, function (err, result) {
                        callback(null, 'two');
                    });
                }, 20000);

            }, function(callback) {
                setTimeout(function () {
                    dao.client.execute(config.queries.update_status, [config.orderStatus.collected, id], {prepare: true}, function (err, result) {
                        callback(null, 'three');
                        done();
                    });
                }, 10000);

            }
        ]);
});

exports.placeOrder = function (req, res) {

    var id = dao.uuid.random();
    var order = {
        "order_id": id,
        "amount": req.body.amount,
        "location": req.body.location,
        "status": config.orderStatus.placed,
        "items": []
    }

    for (var item of req.body.items) {
        order.items.push(item);
    }

    dao.client.execute(config.queries.place_order, [JSON.stringify(order)], {prepare: true}, function (err, result) {
        var response = {};
        if(err){
            response.message = config.message.err_place;
            response.status = config.responde_status.err;
        }
        if(result){
            response.order_id = id;
            response.status = config.responde_status.success;
        }
        console.log(response);
        res.send(response);
        res.end();

    });

};

exports.getOrderById = function (req, res) {

    dao.client.execute(config.queries.get_orderby_id, [req.params.id], {prepare: true}, function (err, result) {
        var response = {};
        if(err){
            response.message = config.message.err_getOrderById;
            response.status = config.responde_status.err;
        }
        if(result){
            response.order_id = req.params.id;
            response.status = config.responde_status.success;
            response.order = result.rows[0];
        }
        console.log(response);
        res.send(response);
        res.end();
    });

};

exports.getOrders = function (req, res) {

    dao.client.execute(config.queries.get_orders, function (err, result) {
        var response = {};
        if(err){
            response.message = config.message.err_place;
            response.status = config.responde_status.err;
        }
        if(result){
            response.status = config.responde_status.success;
            response.orders = result.rows;
        }
        console.log(response);
        res.send(response);
        res.end();
    });

};


exports.updateOrder = function (req, res) {

    var id = req.params.id;
    dao.client.execute(config.queries.get_orderby_id, [id], {prepare: true}, function (err, result) {
        var response = {};
        if(err){
            response.message = config.message.err_update;
            response.status = config.responde_status.err;
            res.send(response);
            res.end();
        }
        if(result){
            if(result.rows[0].status === config.orderStatus.placed){
                var order = {
                    "order_id": id,
                    "amount": req.body.amount,
                    "location": req.body.location,
                    "status": config.orderStatus.placed,
                    "items": []
                }

                for (var item of req.body.items) {
                    order.items.push(item);
                }

                dao.client.execute(config.queries.update_order, [JSON.stringify(order)], {prepare: true}, function (err, result) {
                    response = {};
                    if(err){
                        response.message = config.message.err_update;
                        response.status = config.responde_status.err;
                    }
                    if(result){
                        response.order_id = id;
                        response.status = config.responde_status.success;
                    }
                    console.log(response);
                    res.send(response);
                    res.end();
                });
            }else{
                response.message = config.message.err_update_paid;
                response.status = config.responde_status.err;
                res.send(response);
                res.end();
            }
        }

    });


};

exports.cancelOrder = function (req, res) {

    dao.client.execute(config.queries.get_orderby_id, [req.params.id], {prepare: true}, function (err, result) {
        var response = {};
        if(err){
            response.message = config.message.err_cancel;
            response.status = config.responde_status.err;
            res.send(response);
            res.end();
        }
        if(result){
            if(result.rows[0].status === config.orderStatus.placed){
                dao.client.execute(config.queries.cancel_order, [req.params.id], {prepare: true}, function (err, result) {
                    var response = {};
                    if(err){
                        response.message = config.message.err_cancel;
                        response.status = config.responde_status.err;
                    }
                    if(result){
                        response.order_id = req.params.id;
                        response.status = config.responde_status.success;
                    }
                    console.log(response);
                    res.send(response);
                    res.end();
                });
            }else{
                response.message = config.message.err_cancel_paid;
                response.status = config.responde_status.err;
                res.send(response);
                res.end();
            }
        }

    });

};

exports.payOrder = function (req, res) {

    var id = req.params.id;
    dao.client.execute(config.queries.get_orderby_id, [id], {prepare: true}, function (err, result) {
        var response = {};
        if(err){
            response.message = config.message.err_pay;
            response.status = config.responde_status.err;
            res.send(response);
            res.end();
        }
        if(result){
            if(result.rows[0].status === config.orderStatus.placed ){

                dao.client.execute(config.queries.pay_order, [config.orderStatus.paid, id], {prepare: true}, function (err, result) {
                    var response = {};
                    if(err){
                        response.message = config.message.err_pay;
                        response.status = config.responde_status.err;
                    }
                    if(result){
                        q.push(req.params.id);
                        response.order_id = req.params.id;
                        response.status = config.responde_status.success;
                    }
                    console.log(response);
                    res.send(response);

                });
            }else{
                response.message = config.message.err_pay_paid;
                response.status = config.responde_status.err;
                res.send(response);
                res.end();
            }
        }

    });
};

