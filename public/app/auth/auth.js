angular.module('app.auth', [])

/* controller in charge of login, logout and sign-up pages, 
  also contains logic for profile page - migrate maybe? 
*/
.controller('AuthController', function($scope, $window, $location, Auth) {
  $scope.user = {}; // used to store user input for sign-in/sign-up
  // REMOVE? $scope.profile = $window.localStorage.getItem('com.tp.user')

 /* user sign-in for exisiting users
    routes to trips page upon verification 
 */
  $scope.signin = function() {
    Auth.signin($scope.user)
      .then(function(data) {
        if (data.token) {
          $window.localStorage.setItem('com.tp', data.token); // set token
          $window.localStorage.setItem('com.tp.user', data.id);
          $location.path('/trips');
        } else {
          alert('username or password incorrect.'); // we'll want to handle this better
        }
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  /* user sign-up for first time users 
     sets jwt and re-routes to new trip page to create first trip 
  */
  $scope.signup = function() {
    Auth.signup($scope.user)
      .then(function(data) {
        $window.localStorage.setItem('com.tp', data.token); // set token
        $window.localStorage.setItem('com.tp.user', data.id);
        $location.path('/new-trip');
      })
      .catch(function(error) {
        console.error('catch error', error);
      });
  };

  /* used to retrieve user from database for user profile page
     migrate to profile page 
  */
  $scope.getUser = function(){
    Auth.getUser($scope.user)
      .then(function(data){
        $scope.userData = data;
      });
  };

  /* called from logout button in menu bar for auth pages */
  $scope.signout = function () {
    Auth.signout();
  };

  /* delete account available on profile page - migrate to profile */
  $scope.removeUser = function() {
    Auth.removeUser()
  }
});
