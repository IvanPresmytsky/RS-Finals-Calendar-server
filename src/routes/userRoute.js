"use strict";
const User = require('../models/User.js');

function getUser(req, res) {
  User.findById(req.params._id, (err, user) => {
    if (err) {
      return res.status(404).json(err);
    }
    return res.status(200).json(user);
  });
}

function deleteUser(req, res) {
  let password = req.body.password;
  User.findByIdAndRemove(req.params._id, (err) => {
    if (err) {
      return res.status(404).json(err);
    }
    return res.status(200).json({ message: 'user removed successfully' });
  });
}

function editUser(req, res) {
  let password = req.body.password;
  let confirmedPassword = req.body.confirmedPassword;
  let newPassword = req.body.newPassword;
  let newUsername = req.body.newUsername;

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

        if (confirmedPassword !== newPassword) {
          res.redirect('/');
        }

        user.password = newPassword;

        user.save( (err) => {
          if (err) {
            return res.json(err);
          }
          return res.status(200).json(user);
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
