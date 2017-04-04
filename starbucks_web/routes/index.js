var express = require('express');

/* GET home page. */
exports.getindex = function(req, res, next) {
    res.render('index', { title: 'Starbucks' });
};

exports.getPrices = function (req, res, next) {
    res.json(JSON.stringify({small:1.5, medium:2.0, large:2.5}));
};
