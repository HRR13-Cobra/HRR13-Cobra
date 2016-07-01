// Many of our includes, of which we're probably not using a few anymore...
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
mongoose.connect('mongodb://cobras:cobra123@ds047065.mlab.com:47065/tripplanner');
// mongoose.connect('mongodb://127.0.0.1:27017/tripplanner');

var app = express();

// configures our server to run with our middleware and routes
config(app, express);

//this better stay on 8080 or so help me....
app.listen(8080, function() {
  console.log('listening on port 8080...');
});
