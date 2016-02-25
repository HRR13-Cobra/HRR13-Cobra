var Users = require('./userModel.js');
var Q = require('q');
var Trips = require('../trips/tripModel.js');
var util = require('../config/utils.js');
var authController = require('./../config/authController.js');

module.exports = {
  signup: function(req, res) {
    var newUser = Users({
      username: req.body.username,

      // leave password outside to call newUser's method after instantiation
      // password: Users.generateHash(req.body.password),
    });
    // TODO: did not save salt after hashing
    // TODO: did not work when hashing user password in instantiation
    newUser.password = newUser.generateHash(req.body.password);
    // newUser.salt = newUser.generateSalt(req.body);

    newUser.save(function(err, user) {
      if (err) {
        console.error(err);
      } else {
        var token = authController.createToken(user);
        res.send({
          'token': token,
          'id': user._id //we minght not need this after all
        });
      }
    });

  },

  signin: function(req, res) {
    var userLogin = Users({
      username: req.body.username,
      password: req.body.password,
    });
    // TODO: will refactor into a promise
    Users.findOne({
      'username': userLogin.username
    }, function(err, user) {
      if (!user) {
        // no matching username
        res.send('Not Found');
      } else {
        // compares current password with hashed password from found user
        if (userLogin.comparePasswords(userLogin.password, user.password)) {
          var token = authController.createToken(user);
          Trips.find({
              userId: user._id
            })
            .then(function(found) {
              res.send({
                'token': token,
                'id': user._id //we minght not need this after all
              });
            })
        } else {
          //if user is found, but password doesn't match
          res.send('Incorrect Password');
        }
      }
    })
  },

  logout: function(req, res) {

    // @ref: http://stackoverflow.com/questions/11273988/clearing-sessions-in-mongodb-expressjs-nodejs
    console.log('BEFORE ' + JSON.stringify(req.session));
    req.session.destroy();
    console.log('AFTER ' + req.session);
    res.redirect('/');
  },

  // @req.body expects an user _id for reference to Trips schema
  alltrips: function(req, res) {
    var tripArr;
    console.log('requested by user', req.decoded.username);
    Trips.find({
        'userId': req.decoded.username
      })
      .then(function(results) {
        // console.log(results);
        res.send(results);
      })
      .catch(function(err) {
        console.log('Error all trips catch', err);
        res.status(403)
          .send('No trips found');
      })
  }
};
