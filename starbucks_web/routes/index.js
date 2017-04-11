var express = require('express');
var config = require('./config.json');

/* GET home page. */
exports.getindex = function(req, res, next) {
    res.render('index', { title: config.title });
};
/*returns all Items along with their prices */
exports.getCoffeeDetails = function (req, res, next) {
    res.send(config.coffee);
};

/* returns locations for that will be used for routing */
exports.getLocations = function (req, res, next) {
    res.send(config.locations);
};
