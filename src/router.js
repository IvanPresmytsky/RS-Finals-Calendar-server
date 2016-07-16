var config = require('../config/config.js');
var express = require('express');
var jwt = require('jsonwebtoken');

var User = require('../models/User.js');

var router = express.Router();

function createToken (res, user, secret) {
  var token = jwt.sign(user, secret, { expiresIn: 86400 });
  res.json({
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
    else {

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

    }
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

router.get("/logout", function(req, res) {
  res.redirect("/");
});

router.get('/users', function (req, res) {
  User.find({}, function (err, users) {
    res.json(users);
  });
});

module.exports = router;
