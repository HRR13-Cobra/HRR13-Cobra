angular.module('app.services', [])

.factory('Trips', function($http, $window) {

  //persistent storage of all trips for given user
  var trips = {};
  //pulls the current user for the JWT
  var user = $window.localStorage.getItem('com.tp');
  //loads the current trip as separate storage object
  var tripID = {};

  var allTrips = function(user) {
    return $http({
        method: 'GET',
        url: '/api/users/allTrips'
      })
      .then(function(resp) {
        trips = resp.data;
      })
      .then(function() {
        return trips;
      });
  };

  //populates trips object on instantiation
  allTrips(user);

  var accessTrip = function(tripID) {
    //if accessing page through bookmark or reload, sets the current tripID
    tripID = tripID;
    return $http({
        method: 'GET',
        url: '/api/users/' + tripID
      })
      .then(function(resp) {
        active = resp.data;
      });
  };

  var newTrip = function(destination, startDate) {
    var mydata = {
      destination: destination,
      startDate: startDate
    };
    return $http({
        method: 'POST',
        url: '/api/trips/create',
        data: mydata
      })
      .then(function(data) {
        return data;
      });
  };

  var addDetails = function(flying, leavingCountry, travelingAlone, accomodations, title, details) {
    var tripData = {
      flying: flying,
      leavingCountry: leavingCountry,
      travelingAlone: travelingAlone,
      accomodations: accomodations,
      title: title,
      details: details,
    };
    return $http({
        method: 'POST',
        url: '/api/trip/' + tripID,
        data: tripData
      })
      .then(function(err, response) {
        if (err) {
          console.log('Error:', err);
        }
        allTrips(user);
      });

  };

  return {
    allTrips: allTrips,
    accessTrip: accessTrip,
    newTrip: newTrip,
    trips: trips,
    tripID: tripID,
    addDetails: addDetails
  };

})

.factory('Auth', function($http, $location, $window) {
  // it is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'com.tp'
  // after you signin/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server
  var signin = function(user) {
    return $http({
        method: 'POST',
        url: '/api/users/signin',
        data: user
      })
      .then(function(resp) {
        return resp.data.token;
      });
  };

  var signup = function(user) {
    return $http({
        method: 'POST',
        url: '/api/users/signup',
        data: user
      })
      .then(function(resp) {
        return resp.data.token;
      });
  };

  var isAuth = function() {
    // check for user permissions on each page
    return !!$window.localStorage.getItem('com.tp');
  };

  var signout = function() {
    $window.localStorage.removeItem('com.tp');
    $location.path('/signin');
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});
