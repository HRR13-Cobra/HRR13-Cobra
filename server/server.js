var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/middleware.js');
var schedule = require('node-schedule');
var email = require('./notification_service/mailer.js');
var notification = require('./notification_service/notification.js');
var Trips = require('./trips/tripModel.js');
var moment = require('moment');

//create connection to database
// mongoose.connect('mongodb://cobras:cobras123@ds047065.mongolab.com:47065/tripplanner');
mongoose.connect('mongodb://127.0.0.1:27017/tripplanner');

// test on saving a user to database
var User = require('./users/userModel.js');

var Trip = require('./trips/tripModel.js');

/**
* kill current process if port is already in use at
* http://stackoverflow.com/questions/6478113/unable-to-start-mongodb-local-server
*/

// var rule = new schedule.RecurrenceRule();
// // rule.dayOfWeek = [0,1,2,3,4,5,6];
// rule.hour = 17;
// rule.minute = 1;


// var j = schedule.scheduleJob(rule, function(){
//   var trips = notification.getTripsForReminder()
//   console.log('heeeeyyyy')
//   trips.forEach(function(trip){
//     // Email.signinEmail(userLogin.username)
//     var userEmail = trip.userId
//     console.log('userid', trip.userId)
//     return email.reminderEmail(userEmail)
//   })
// });


var app = express();

// configures our server to run with our middleware and routes
config(app, express);

//this better stay on 8080 or so help me....
app.listen(8080, function() {
  console.log('listening on port 8080...');
});
