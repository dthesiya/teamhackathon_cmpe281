var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
var apis = require('./routes/apis');
//app.set('view engine', 'ejs');
//app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
//app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'views')));

//app.use('/', index);
//p.use('/placeorder',placeorder);
//app.use('/api', api);
app.use('/',apis);
//var database = require('./database/db.js');

app.set('port', process.env.PORT || 3000); 

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
