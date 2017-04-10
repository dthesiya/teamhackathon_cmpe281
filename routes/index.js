var express = require('express');
var config = require('./config.json');

/* GET home page. */
exports.getindex = function(req, res, next) {
    res.render('index', { title: config.title });
};

exports.getCoffeeDetails = function (req, res, next) {
    res.send(config.coffee);
};

exports.getLocations = function (req, res, next) {
    res.send(config.locations);
};
