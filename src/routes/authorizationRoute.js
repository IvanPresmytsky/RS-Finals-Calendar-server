"use strict";
const config = require('../config/config.js');
const createToken = require('../utils/createToken.js');
const User = require('../models/User.js');

function signIn (req, res) {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({username: username}, (err, user) => {
    if(!user) {
      return res.status(404).json({message: 'this user is not exist'});
    }
    if (err) {
      return res.status(404).json({message: 'this user is not exist'});
    }
    user.checkPassword(password, (err, isMatch) => {
      if (err) {
        return res.status(401).json({message: 'invalid password!!!'});
      }
      if (isMatch) {
        createToken(res, user);
      } else {
        return res.status(401).json({
          message: 'Invalid password!',
        });
      }
    });
  });
}

function signUp (req, res) {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({username: username}, (err, user) => {
    if (err) {
      return res.json({err: err});
    }
    if (user) {
      return res.status(300).json({message: 'this user is already exist'});
    }
    let newUser = new User({
      username: username,
      password: password,
      events: [{
        title: 'hui',
        date: '2016-08-01',
        _id: [ObjectID]
      }]
    });
    newUser.save( (err) => {
      if (err) {
        console.log('**********************');
        console.log(err);
        console.log('**********************');
        return res.json(err);
      }
      return res.status(201).json({message: 'user created successfully'});
    });
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
