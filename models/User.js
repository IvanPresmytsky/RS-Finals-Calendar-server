var bcrypt = require('bcrypt-nodejs');
var config = require('../config/config.js');
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  createAt: { type: Date, default: Date.now }
});

var noop = function() {};

userSchema.pre('save', function(done){
  var user = this;

  if (!user.isModified('password')) {
    return done();
  }

  bcrypt.genSalt(config.salt, function (err, salt) {
    if(err) return done(err);
    bcrypt.hash(user.password, salt, noop, function (err, hashedPassword) {
      if(err) return done(err);
      user.password = hashedPassword;
      done();
    });
  });
});

userSchema.methods.checkPassword = function (guess, done) {
  bcrypt.compare(guess, this.password, function (err, isMatch) {
    done(err, isMatch);
  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
