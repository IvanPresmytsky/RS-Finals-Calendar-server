"use strict";
const User = require('../models/User.js');
const verifyToken = require('../utils/verifyToken.js');

function getUser(req, res) {
  verifyToken(req, res);
  User.findById(req.params._id, (err, user) => {
    if (err) {
      return res.status(404).json(err);
    }
    return res.status(200).json(user);
  });
}

function deleteUser(req, res) {
  let password = req.body.password;

  verifyToken(req, res);

  User.findById(req.params._id, (err, user) => {
    user.checkPassword(password, (err, isMatch) => {
      if (err) {
        return res.status(401).json(err);
      }
      if (isMatch) {

        user.remove( (err) => {
          if (err) {
            return res.json(err);
          }
          return res.status(200).json({ message: 'user removed successfully' });
        });
        
      } else {
        return res.status(401).json({
          message: 'Invalid password!',
        });
      }
    });
  });

}

function editUser(req, res) {  
  let password = req.body.password;
  let newPassword = req.body.newPassword;
  let newUsername = req.body.newUsername;

  verifyToken(req, res);

  User.findOne({username: newUsername}, (err, user) => {
    if (user && (user._id != req.params._id)) {
      return res.status(300).json({message: 'this user is already exist'});
    }
  });

  User.findById(req.params._id, (err, user) => {
    if (err) {
      return res.status(404).json(err);
    }
    user.checkPassword(password, (err, isMatch) => {
      if (err) {
        return res.status(401).json(err);
      }
      if (isMatch) {

        user.username = newUsername || user.username;
        user.password = newPassword;

        user.save( (err) => {
          if (err) {
            return res.json(err);
          }
          return res.status(200).json({message: 'user edited successfully'});
        });
        
      } else {
        return res.status(401).json({
          message: 'Invalid password!',
        });
      }
    });
  });
}

function userRoute(router) {

  const userRoute = router.route('/users/:_id');
  const userEditingRoute = router.route('/users/:_id/edit');

  userRoute.get(getUser);

  userRoute.delete(deleteUser);

  userEditingRoute.put(editUser);

}

module.exports = userRoute;
