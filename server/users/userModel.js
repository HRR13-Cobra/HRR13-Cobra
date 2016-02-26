var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Q = require('q');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: String,
  address: {type: String},
  phone: {type: String},
  
});

UserSchema.methods = {
  generateHash: function(password) {
    // @method .genSaltSync(9) to encrypt 9 times
    console.log(password);
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
    // bcrypt.hash(password, null, null, function(err, hash) {
    //   if(err) console.log('error');
    //   console.log(hash);
    // })
  },
  comparePasswords: function(inputPassword, hash) {
    // How is salt involved in compareSync?
    return bcrypt.compareSync(inputPassword, hash);
  },
  generateSalt: function(req) {
    bcrypt.genSalt(9)
      .then(function(result) {
        console.log('result: ' + result);
      })
      .catch(function(err) {
        console.log(err);
      })

  }
}

module.exports = mongoose.model('users', UserSchema);
