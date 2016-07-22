"use strict";

const _ = require('lodash');
const authorizationRoute = require('./authorizationRoute');
const config = require('../config/config.js');
const express = require('express');
const jwt = require('jsonwebtoken');
const secret = require('../../secret/secret.js');
const User = require('../models/User.js');
const userEventsRoute = require('./userEventsRoute');
const userRoute = require('./userRoute');

const router = express.Router();

function verifyToken (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({message: 'failed to authenticate token.', err: err });
      }
      else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).json({
      message: 'No token provided.'
    });
  }
}

router.use((req, res, next) => {
  authorizationRoute(router);
  next();
});

router.use(verifyToken);

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
