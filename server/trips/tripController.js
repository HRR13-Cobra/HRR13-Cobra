var Trip = require('./tripModel.js');

module.exports = {

  create: function(req, res) {
    var newTrip = new Trip({
      destination: req.body.destination,
      startDate: req.body.startDate,
      userId: req.decoded.username,
      POI: [],
      coordinates: req.body.coordinates,
    });
    console.log('newTrip', newTrip);
    newTrip.save(function(err, savedTrip) {
      if (err) {
        res.status(404).send(err);
        console.log(err);
      } else {
        // TODO: save trip objectID to user document in session

        console.log('Trip saved, ID: ' + savedTrip._id);
        res.status(201).send(savedTrip._id);
      }
    });
  },
  remove: function(req, res, body) {

    console.log(req.decoded.username, 'wants to remove', req.body.destination);
    Trip.remove({
      userId: req.decoded.username,
      destination: req.body.destination
    }, function(err) {
      if(err) console.error(err);
      console.log('successfully removed..')
    });

  },
  modify: function(req, res) {
    Trip.findOne({
      _id: req.body._id
    }, function(err, trip) {
      if (err) {
        res.send('failed');
      } else {
        trip.POI.push({
          title: req.body.title,
          details: req.body.details
        });
        res.status(201).send('Trip modified');
        trip.save(function(err, data) {
        });
      }
    });
  },
  getTripView: function(req, res, body) {
    Trip.findOne({
        _id: req.params.tripId
      })
      .then(function(trip) {
        console.log('trip being returned', trip)
        res.send(trip);
      })
      .catch(function(err) {
        console.log('Trip not found');
        res.status(403).send('Trip not found');
      });

  },
};