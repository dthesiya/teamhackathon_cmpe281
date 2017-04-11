var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
var apis = require('./routes/apis');

app.use('/',apis); 
//var database = require('./database/db.js');

app.set('port', process.env.PORT || 3000); 

app.use(function (req, res, next) {
	var response = {};

    response.status = 404;
 	response.message = "Not found";
 	res.send(response);
 	res.end();
});

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
