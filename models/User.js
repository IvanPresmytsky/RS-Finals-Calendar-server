var bcrypt = require('bcrypt-nodejs');
var config = require('../config/config.js');
var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
  id: {type: String, required: true, unique: true},
  title: { type: String, required: true, trim: true },
  text: { type: String, trim: true },
  date: { type: Date, required: true },
  startTime: { type: Date },
  endTime: { type: Date }
});

var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true},
  createAt: { type: Date, default: Date.now },
  events: [eventSchema]
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
