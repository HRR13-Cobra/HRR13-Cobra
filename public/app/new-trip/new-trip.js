angular.module('app.new-trip', [])

.controller('new-tripController', function($scope, $location, $window, Trips) {

  $scope.createTrip = function(destination, startDate) {
  	console.log($window.localStorage.getItem('com.tp'));
    Trips.newTrip(destination, startDate)
      .then(function(response) {
      	var tripID = response.data.trips.pop()._id;
      })
  };

});
