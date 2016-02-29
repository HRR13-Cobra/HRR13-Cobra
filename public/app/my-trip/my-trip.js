angular.module('app.my-trip', [])

.controller('my-tripController', function($scope, $location, Trips, $route, Auth) {
 
  $scope.thisTrip = {}; //stores information about the current trip, to display on page??
  $scope.path = $location.path().substring(9); // gets trip id from 

  /* reqests information about the current trip from the Trips factory */
  $scope.getTrip = function () {
    Trips.accessTrip($scope.path)
      .then(function (data) {
        if (data === "") $location.path('/trips');;
        $scope.thisTrip = data;
      });

  };

  /* 
    reloads the page so you see the new sight you added
    REFACTOR: reload implementation should be changed to something more elegant?
  */
  $scope.addPOI = function (poi_title, poi_detail) {
    Trips.addPOI($scope.path, poi_title, poi_detail)
      .then(function (data) {
        $route.reload();
      });
  };

  /* 
    reloads page so you can see box you checked (?)
    REFACTOR: reload implementation should be changed to something more elegant?
  */
  $scope.triggerCheck = function (string, value) {
    Trips.addTrigger($scope.path, string, value)
      .then(function (data) {
        $route.reload(); //reloads the page so you see the new sight you added
      });
  };

  /* called from logout button in menu bar for auth pages */
  $scope.signout = function () {
    Auth.signout();
  };

  $scope.editedSights = null;

  $scope.newSights = function (){ 
    $scope.Sights.push({name:"new record"});
  };

  $scope.startEditing = function (Sights){
    console.log('start editing');
    Sights.editing=true;
    $scope.editedSights = Sights;
    console.log(Sights, $scope.editedSights);
  };
      
  $scope.doneEditing = function (Sights){
    
    Sights.editing=false;
    $scope.editedSights = null;
  };


  /* run on my-trip page load */
  $scope.getTrip();

});
