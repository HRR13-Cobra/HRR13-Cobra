var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');

module.exports = function(app, express) {

  app.use(bodyParser.json());
  app.use(cookieParser());
  // app.use(session({
  //   secret: 'keyboard cat',
  //   cookie: {
  //     maxAge: 300
  //   },
  //   resave: true,
  //   saveUninitialized: true
  // }));
  // app.use(passport.initialize());
  // app.use(passport.session());
  // // enables access
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  //
  // // TODO: complete session function
  //
  var userRouter = express.Router();
  var tripRouter = express.Router();
  //
  // // TODO: how will user be redirected differently if not logged in
  // // angular? should server send a JSON instead of redirecting?
  // app.use('/newmap', express.static(__dirname + '/../../public/app/new-trip/new-map.html'));
  app.use(express.static(__dirname + '/../../public'));
  app.use('/api/users', userRouter);
  app.use('/api/trips', tripRouter);

  require('../users/userRoutes')(userRouter);
  require('../trips/tripRoutes')(tripRouter);
};
