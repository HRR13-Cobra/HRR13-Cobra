angular.module('app.services', [])

.factory('Trips', function($http, $window) {

  //persistent storage of all trips for given user
  var trips = {};
  //pulls the current user for the JWT
  var user = $window.localStorage.getItem('com.tp.user');
  //loads the current trip as separate storage object
  var tripID = {};

  var allTrips = function(user) {
    return $http({
        method: 'GET',
        url: '/api/users/alltrips',
        data: user
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
        url: '/api/trips/' + tripID
      })
      .then(function(resp) {
        return resp.data;
      });
  };

  var newTrip = function(destination, startDate, coordinates) {
    return $http({
        method: 'POST',
        url: '/api/trips/create',
        data: {
          destination: destination,
          startDate: startDate,
          coordinates: coordinates,
        }
      })
      .then(function(data) {
        console.log(data.data);
        tripID = data.data;
        return data.data;
      });
  };

  var removeTrip = function(target) {
    return $http({
        method: 'POST',
        url: 'api/trips/remove',
        data: {
          'destination': target
        }
      })
      .then(function(results) {
        return results;
      });
  };

  var addPOI = function(tripID, title, details) {
    var tripData = {
      _id: tripID,
      title: title,
      details: details,
    };
    return $http({
      method: 'PUT',
      url: '/api/trips/modify',
      data: tripData
    });
  };
  //someone please refactor me!!!!
  var addTrigger = function(tripID, string, value) {
    var tripData = {};
    if (string === 'flying') {
      tripData = {
        _id: tripID,
        flying: value
      }
    }
    if (string === 'leavingCountry') {
      tripData = {
        _id: tripID,
        leavingCountry: value
      }
    }
    if (string === 'travelingAlone') {
      tripData = {
        _id: tripID,
        travelingAlone: value
      }
    }
    if (string === 'accomodations') {
      tripData = {
        _id: tripID,
        accomodations: value
      }
    }
    return $http({
      method: 'PUT',
      url: '/api/trips/modify2',
      data: tripData
    });
  };
  return {
    allTrips: allTrips,
    accessTrip: accessTrip,
    newTrip: newTrip,
    trips: trips,
    tripID: tripID,
    addPOI: addPOI,
    removeTrip: removeTrip,
    addTrigger: addTrigger
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
        return resp.data;
      });
  };

  var signup = function(user) {
    return $http({
        method: 'POST',
        url: '/api/users/signup',
        data: user
      })
      .then(function(resp) {
        return resp.data;
      });
  };

  var isAuth = function() {
    // check for user permissions on each page
    return !!$window.localStorage.getItem('com.tp');
  };

  var signout = function() {
    $window.localStorage.removeItem('com.tp');
    $window.localStorage.removeItem('com.tp.user');
    $location.path('/logout');
  };

  var removeUser = function() {
    console.log('services removing user')
    return $http({
        method: 'GET',
        url: '/api/users/remove',
      })
      .then(function() {
        $window.localStorage.removeItem('com.tp');
        $window.localStorage.removeItem('com.tp.user');
        $location.path('/signup');
      });
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout,
    removeUser: removeUser
  };
});
