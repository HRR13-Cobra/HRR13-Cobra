angular.module('app.auth', [])

.controller('AuthController', function($scope, $window, $location, Auth) {
  $scope.user = {};

  $scope.signin = function() {
    Auth.signin($scope.user)
      .then(function(data) {
        if (data.token) {
          $window.localStorage.setItem('com.tp', data.token);
          $window.localStorage.setItem('com.tp.user', data.id);
          $location.path('/trips');
        } else {
          //we'll want to handle this better
          alert('username or password incorrect.');
        }
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.signup = function() {
    Auth.signup($scope.user)
      .then(function(data) {
        $window.localStorage.setItem('com.tp', data.token);
        $window.localStorage.setItem('com.tp.user', data.id);
        $location.path('/profile');
      })
      .catch(function(error) {
        console.error('catch error', error);
      });
  };

  $scope.getUser = function(){
    Auth.getUser($scope.user)
      .then(function(data){
        $scope.userData = data;
      });
  };

  $scope.signout = function() {
    Auth.signout();
  };
});
