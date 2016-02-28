angular.module('app.my-trip', [])

.controller('my-tripController', function($scope, $location, Trips, $route, Auth) {

  //stores information about the current trip
  $scope.thisTrip = {};
  $scope.path = $location.path().substring(9);
  //reqests information about the current trip from the Trips factory
  $scope.getTrip = function() {
    Trips.accessTrip($scope.path)
      .then(function(data) {
        if (data === "") $location.path('/trips');;
        $scope.thisTrip = data;
      });

  };
  $scope.getTrip();

  //sends user edits to the Trips factory
  $scope.addPOI = function(poi_title, poi_detail) {
    Trips.addPOI($scope.path, poi_title, poi_detail)
      .then(function(data) {
        //reloads the page so you see the new sight you added
        //this should be changed to something more elegant
        $route.reload();
      });
  };

  $scope.triggerCheck = function(string, value) {
    Trips.addTrigger($scope.path, string, value)
      .then(function(data) {
        //reloads the page so you see the new sight you added
        //this should be changed to something more elegant
        $route.reload();
      });
  };

  $scope.signout = function() {
    Auth.signout();
  };

  $scope.editedSights = null;

  $scope.newSights = function(){ 
    $scope.Sights.push({name:"new record"});
  }

  $scope.startEditing = function(Sights){
    console.log('start editing');
    Sights.editing=true;
    $scope.editedSights = Sights;
    console.log(Sights, $scope.editedSights);
  }
      
  $scope.doneEditing = function(Sights){
    
    Sights.editing=false;
    $scope.editedSights = null;
  }
})
