var mongoose = require('mongoose');

var TripSchema = new mongoose.Schema({
  destination: String,
  userId: String,
  startDate: Date,
  POI: Array,
  coordinates: Object
});

module.exports = mongoose.model('trips', TripSchema);
