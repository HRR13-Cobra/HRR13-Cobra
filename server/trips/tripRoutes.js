var tripController = require('./tripController.js');
var authController = require('./../config/authController.js');
var yelp = require('./yelpAPI');
var express = require('express');

module.exports = function(app) {
  // FIXME: restore auth for create	
  app.post('/create', authController.authorize, tripController.create);
  app.post('/remove',authController.authorize, tripController.remove);
  app.put('/modify/',authController.authorize, tripController.modify);
  app.put('/modify2/',authController.authorize, tripController.modify2);
  app.get('/:tripId', tripController.getTripView);
  app.get('/yelp/:city', yelp.getPOI);
  app.delete('/poi', tripController.removePOI);
  app.post('/yelp/overlay', yelp.getOverlay);

};
