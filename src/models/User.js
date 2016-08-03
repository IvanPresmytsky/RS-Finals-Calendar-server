const bcrypt = require('bcrypt-nodejs');
const config = require('../config/config.js');
const mongoose = require('mongoose');

const eventSchema = require('./Event.js');

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true},
  createAt: { type: Date, default: Date.now },
  events: [eventSchema]
});

const noop = function () {};

userSchema.pre('save', function (done) {
  console.log(this);
  if (!this.isModified('password')) {
    return done();
  }
  bcrypt.genSalt(config.salt, (err, salt) => {
    if (err) {
      return done(err);
    }
    bcrypt.hash(this.password, salt, noop, (err, hashedPassword) => {
      if (err) {
        return done(err);
      }
      console.log(this.password);
      console.log(hashedPassword);
      this.password = hashedPassword;
      done();
    });
  });
});

userSchema.methods.checkPassword = function (guess, done) {
  console.log(this.password);
  console.log(guess);
  bcrypt.compare(guess, this.password, (err, isMatch) => {
    console.log(isMatch);
    console.log(err);
    done(err, isMatch);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
