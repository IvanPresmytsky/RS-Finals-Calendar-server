"use strict";

const bodyParser = require('body-parser');
const config = require('./config/config.js');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const router = require('./routes/router.js');

const app = express();

app.use(morgan('dev'));

mongoose.connect(config.db);

const db = mongoose.connection;

if (!db) {
  return process.exit(1);
}

app.set('port', config.port);

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', router);

app.get('/', (req, res) => {
  return res.json({message: 'Hello! The API is at http://localhost:' + app.get('port') + '/api'});
});

app.listen(app.get('port'), () => {
  console.log('Server started on port ' + app.get('port'));
});
