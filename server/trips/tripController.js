var Trip = require('./tripModel.js');
var authController = require('./../config/authController.js');
var UserModel = require('./../users/userModel.js');

module.exports = {
  create: function(req, res, body){
    console.log(req.body);
    var newTrip = Trip({
      destination: req.body.destination,
      startDate: req.body.startDate,
    });

    newTrip.save(function(err, savedTrip) {
      if(err) {
        res.status(404).send(err);
        console.log(err);
      } else {
        // TODO: save trip objectID to user document in session
        console.log('Trip saved, ID: ' + savedTrip._id);
        UserModel.findOneAndUpdate(
          {_id: savedTrip._id},
          {$push:{"trips": savedTrip}}, 
          function(err, saved) {
            if(err) console.error(err);
            else {
              res.status(201).send(saved);
              console.log(saved);
            }
          }
          )
      }
    });


  },
  remove: function(req, res, body){
    Trip.remove({ _id: req.body._id }, function(err){
      if(!err) {
        console.log('Message removed: ' + req.body._id);
        res.status(200).send('ok');
      } else {
        res.status(404).send('Cannot remove message');

        console.log('Cannot remove message');
      }
    });
  },
  modify: function(req, res, body){
    Trip.find({ _id: req.body._id }, function(err, trip) {
      if (err) {
        res.send('failed');
      } else {

        console.log(req.body);
        trip.destination = req.body.destination;
        trip.startDate = req.body.startDate;
        res.status(201).send('modified');

        // trip.save(function(err) {
        //   if(err) console.log('cannot save trip');
        //   res.send('trip modified');
        // });
      }
    });
  },
  getTripView: function(req, res, body) {
    console.log(req.params.tripId);
    Trip.find({_id: req.params.tripId})
      .then(function(trip){
        res.send(trip)
      })
      .catch(function(err){
        console.log('Trip not found');
        res.status(403).send('Trip not found');
      });

  },
};