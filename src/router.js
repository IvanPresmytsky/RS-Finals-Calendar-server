var config = require('../config/config.js');
var express = require('express');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var User = require('../models/User.js');

var router = express.Router();
var userRoute = router.route('/users/:_id');
var userEventsRoute = router.route('/users/:_id/events');
var userEditingRoute = router.route('/users/:_id/edit');

function createToken (res, user, secret) {
  var token = jwt.sign(user, secret, { expiresIn: 86400 });
  res.json({
    user: user,
    success: true,
    message: 'token created',
    token: token
  });
}

router.get('/', function (req, res){
  res.json({ message: 'API is here!' });
})

router.post('/signin', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}, function (err, user) {
    if(err) return next(err);
    if(!user) return next(err);
    user.checkPassword(password, function (err, isMatch) {
      if(err) next(err);
      if (isMatch) {
        createToken(res, user, config.secret);
      } else {
        res.json({
          success: false,
          message: 'Invalid password!',
        });
      }
    });
  });
});

router.post('/signup', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}, function(err, user) {
    if(err) return next(err);
    if(user) {
      req.flash('error', 'User already exist');
      return res.redirect('/api/users');
    }
    var newUser = new User({
      username: username,
      password: password
    });

    newUser.save(next);
    createToken(res, newUser, config.secret);
  });
});

router.use( function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.json({ success: false, message: 'failed to authenticate token.' });
      else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

router.post("/logout", function(req, res) {
  res.redirect("/");
});

router.get('/users', function (req, res) {
  User.find({}, function (err, users) {
    res.json(users);
  });
});

userRoute.get( function(req, res) {
  User.findById(req.params._id, function(err, user) {
    if (err) res.send(err);
    res.json(user);
  });
});

userEventsRoute.get( function(req, res) {
  User.findById(req.params._id, function(err, user) {
    if (err) res.send(err);
    res.json(user.events);
  });
});

userEditingRoute.put( function(req, res) {
  var password = req.body.password;
  var confirmedPassword = req.body.confirmedPassword;
  var newPassword = req.body.newPassword;
  var newUsername = req.body.newUsername;

  User.findById(req.params._id, function (err, user) {
    if(err) res.send(err);
    if(!user) return res.redirect('/api/users');
    user.checkPassword(password, function (err, isMatch) {
      if(err) res.send(err);
      if (isMatch) {
        user.username = newUsername || user.username;
        if (confirmedPassword !== newPassword) res.redirect('/api/users');
        user.password = newPassword;

        user.save(function(err) {
          if(err) res.send(err);
          res.json(user);
        });
 //       createToken(res, user, config.secret);
      } else {
        res.json({
          success: false,
          message: 'Invalid password!',
        });
      }
    });
  });
});

userRoute.put( function(req, res) {
  var targetEvent = req.body.event;
  var action = req.body.action;

  User.findById(req.params._id, function (err, user) {
    if(err) res.send(err);
    if(!user) return res.redirect('/api/users');
    if (action === 'ADD') user.events.push(targetEvent);
    if (action === 'DELETE') {
      user.events = _.filter(user.events, function(event) {
        return event.id !== targetEvent.id;
      });
    }
    if(action === 'SAVE') {
      user.events = _.filter(user.events, function(event) {
        return event.id !== targetEvent.id;
      });
      user.events.push(targetEvent);
    }

    user.save(function(err) {
      if(err) res.send(err);
      res.json(user);
    });

  });
});

userRoute.delete(function(req, res) {
  var password = req.body.password;
  User.findByIdAndRemove(req.params._id, function(err) {
    if(err) res.send(err);
    res.json({ message: 'user removed successfully' });
  });
});

module.exports = router;
