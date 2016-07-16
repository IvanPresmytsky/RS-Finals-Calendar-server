var bodyParser = require('body-parser');
var config = require('../config/config.js');
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');

var router = require('./router.js');

var app = express();

mongoose.connect(config.db);

var db = mongoose.connection;

if(!db) console.log('db connection error');

app.set('port', config.port);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

app.use('/api', router);

app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + app.get('port') + '/api');
});

app.listen(app.get('port'), function() {
  console.log('Server started on port ' + app.get('port'));
});
