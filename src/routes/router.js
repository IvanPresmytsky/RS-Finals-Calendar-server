"use strict";
const authorizationRoute = require('./authorizationRoute');
const express = require('express');
const User = require('../models/User.js');
const userEventsRoute = require('./userEventsRoute');
const userRoute = require('./userRoute');

const router = express.Router();

router.use(function(req, res, next) {
  res.status(200).header('Access-Control-Allow-Origin', '*');
  res.status(200).header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.status(200).header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
  next();
});

router.use((req, res, next) => {
  authorizationRoute(router);
  next();
});

router.get('/users', (req, res) => {
  User.find({}, (err, users) => {
    if(err) {
      return res.status(404).json(err);
    }
    return res.status(200).json(users);
  });
});

router.use( (req, res, next) => {
  userRoute(router);
  next();
});

router.use((req, res, next) => {
  userEventsRoute(router);
  next();
});



module.exports = router;
