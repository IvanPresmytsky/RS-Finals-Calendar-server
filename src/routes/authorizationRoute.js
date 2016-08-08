"use strict";
const config = require('../config/config.js');
const createToken = require('../utils/createToken.js');
const User = require('../models/User.js');

function signIn (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({username: username}, (err, user) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    if (!user) {
      return next(err);
    }
    user.checkPassword(password, (err, isMatch) => {
      if (err) {
        console.log('authorization error' + err);
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
  let confirmedPassword = req.body.confirmedPassword;

  User.findOne({username: username}, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user) {
      return res.redirect('/');
    }
    if (password !== confirmedPassword) {
      return res.json({
        message: 'confirmed password is not equal to password!'
      }).redirect('/');
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
  return res.status(200).json({
    message: 'token deleted'
  }).redirect('/');
}

let authorizationRoute = (router) => {

  router.post('/signin', signIn);

  router.post('/signup', signUp);

  router.post("/signout", signOut);

};

module.exports = authorizationRoute;
