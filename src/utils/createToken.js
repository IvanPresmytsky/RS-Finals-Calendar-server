"use strict";
const secret = require('../secret/secret.js');
const jwt = require('jsonwebtoken');


function createToken (res, user) {
  let token = jwt.sign(user, secret, { expiresIn: 86400 });
  return res.status(201).json({
    username: user.username,
    userId: user._id,
    message: 'token created',
    token: token
  });
}

module.exports = createToken;
