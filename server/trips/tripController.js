var Trip = require('./tripModel.js');

module.exports = {
  create: function(req, res) {
    console.log(req.body)
    var newTrip = new Trip({
      destination: req.body.destination,
      startDate: req.body.startDate,
      userId: req.decoded.username,
      POI: [],
      coordinates: req.body.coordinates,
    });
    newTrip.save(function(err, savedTrip) {
      if (err) {
        res.status(404).send(err);
        console.log(err);
      } else {
        // TODO: save trip objectID to user document in session
        res.status(201).send(savedTrip._id);
      }
    });
  },
  remove: function(req, res) {

    console.log(req.decoded.username, 'wants to remove', req.body.destination);
    Trip.remove({
      // userId: req.decoded.username,
      _id: req.body.destination._id
    }, function(err) {

      if (err) {
        console.error(err);
      }
      console.log('successfully removed..');
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
        trip.save(function(err, data) {});
      }
    });
  },
  modify2: function(req, res) {
    Trip.findOne({
      _id: req.body._id
    }, function(err, trip) {
      if (err) {
        res.send('failed');
      } else {
        if (req.body.flying) trip.flying = req.body.flying;
        if (req.body.leavingCountry) trip.leavingCountry = req.body.leavingCountry;
        if (req.body.travelingAlone) trip.travelingAlone = req.body.travelingAlone;
        if (req.body.accomodations) trip.accomodations = req.body.accomodations;
        res.status(201).send('Trip modified');
        trip.save(function(err, data) {
          console.log('data',data);
        });
      }
    });
  },
  getTripView: function(req, res) {
    Trip.findOne({
        _id: req.params.tripId
      })
      .then(function(trip) {
        res.send(trip);
      })
      .catch(function(err) {
        console.log('Trip not found');
        res.status(403).send('Trip not found');
      });

  },
  removePOI: function(req, res) {
    console.log('removing poi');
    console.log(req.body);
    res.status(200).send('sup');
  }
};