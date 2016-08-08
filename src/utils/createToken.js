"use strict";
const secret = require('../../secret/secret.js');
const jwt = require('jsonwebtoken');


function createToken (res, user, secret) {
  let token = jwt.sign(user, secret, { expiresIn: 86400 });
  return res.status(201).json({
    user: user,
    message: 'token created',
    token: token
  });
}

module.exports = createToken;