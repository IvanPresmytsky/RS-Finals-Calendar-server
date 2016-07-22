"use strict";
const config = require('../config/config.js');
const secret = require('../../secret/secret.js');
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');


function createToken (res, user, secret) {
  let token = jwt.sign(user, secret, { expiresIn: 86400 });
  return res.status(201).json({
    user: user,
    message: 'token created',
    token: token
  });
}

function signIn (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({username: username}, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(err);
    }
    user.checkPassword(password, (err, isMatch) => {
      if (err) {
        next(err);
      }
      if (isMatch) {
        createToken(res, user, secret);
      } else {
        return res.status(401).json({
          message: 'Invalid password!',
        });
      }
    });
  });
}

function signUp (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({username: username}, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user) {
      return res.redirect('/');
    }
    let newUser = new User({
      username: username,
      password: password
    });

    newUser.save(next);
    createToken(res, newUser, secret);
  });
}

function signOut (req, res) {
  //res.
  return res.status(200).json({
    message: 'token deleted',
    token: null
  }).redirect("/");
}

let authorizationRoute = (router) => {

  router.post('/signin', signIn);

  router.post('/signup', signUp);

  router.post("/signout", signOut);

};

module.exports = authorizationRoute;
