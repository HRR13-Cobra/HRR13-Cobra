angular.module('app.new-trip', [])

.controller('new-tripController', function($scope, $location, $window, Trips) {

  $scope.createTrip = function(destination, startDate) {
  	console.log($window.localStorage.getItem('com.tp'));
    Trips.newTrip(destination, startDate)
      .then(function(data) {
        // $location.path('#/my-trip/')
      })
  };

});
