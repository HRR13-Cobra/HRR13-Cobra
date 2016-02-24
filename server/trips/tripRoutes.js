var tripController = require('./tripController.js');
var authController = require('./../config/authController.js');
var express = require('express');
module.exports = function(app) {
  // FIXME: restore auth for create
  app.post('/create', tripController.create);
  app.post('/remove',authController.authorize, tripController.remove);
  app.put('/modify/',authController.authorize, tripController.modify);
  app.get('/:tripId', tripController.getTripView);
};