var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/middleware.js');
//create connection to database

mongoose.connect('mongodb://cobras:cobra123@ds047065.mongolab.com:47065/tripplanner');

// test on saving a user to database
var User = require('./users/userModel.js');

var Trip = require('./trips/tripModel.js');

/**
* kill current process if port is already in use at
* http://stackoverflow.com/questions/6478113/unable-to-start-mongodb-local-server
*/

var app = express();

// configures our server to run with our middleware and routes
config(app, express);

// FIXME: add dynamic port before deployment (process.env.NODE_ENV)
app.listen(8080);

console.log('listening on 8080');
