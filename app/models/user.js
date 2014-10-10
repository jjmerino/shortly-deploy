var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var userSchema = new Schema({
  username:  String,
  password: String,
});

var User = mongoose.model('User', userSchema);

User.prototype.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};


userSchema.pre('save', function (next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

module.exports = User;

