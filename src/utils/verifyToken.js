"use strict";
const jwt = require('jsonwebtoken');
const secret = require('../../secret/secret.js');

function verifyToken (req, res) {
  let token = req.body.token;
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({message: 'failed to authenticate token.', err: err });
    }
    else {
      req.decoded = decoded;
    }
  });
}

module.exports = verifyToken;