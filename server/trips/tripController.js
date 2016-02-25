var Trip = require('./tripModel.js');

module.exports = {

  create: function(req, res) {
    var newTrip = new Trip({
      destination: req.body.destination,
      startDate: req.body.startDate,
      userId: req.decoded.username,
      POI: []
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
        // UserModel.findOneAndUpdate({
        //     _id: savedTrip._id
        //   }, {
        //     $push: {
        //       "trips": savedTrip
        //     }
        //   },
        //   function(err, saved) {
        //     if (err) console.error(err);
        //     else {
        //       res.status(201).send(saved);
        //       console.log(saved);
        //     }
        //   }
        // )
      }
    });
  },
  remove: function(req, res, body) {
    Trip.remove({
      _id: req.body._id
    }, function(err) {
      if (!err) {
        console.log('Trip removed: ' + req.body._id);
        res.status(200).send('ok');
      } else {
        res.status(404).send('Cannot remove trip');

        console.log('Cannot remove trip');
      }
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