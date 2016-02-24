angular.module('tp', [
    'app.services',
    'ngRoute',
    'ui.router',
    'app.my-trip',
    'app.new-trip',
    'app.trips',
    'app.auth'
  ])
  .config(function($stateProvider, $urlRouterProvider, $httpProvider, $routeProvider) {
    // For any unmatched url, redirect to /
    
    // Now set up the routes
    $routeProvider
      .when('/trips', {
        authenticate: true,
        templateUrl: 'app/trips/trips.html',
        controller: 'tripsController'
      })
      .when('/new-trip', {
        authenticate: true,
        templateUrl: 'app/new-trip/new-trip.html',
        controller: 'new-tripController'
      })
      .when('/my-trip/:tripID', {
        authenticate: true,
        templateUrl: 'app/my-trip/my-trip.html',
        controller: 'my-tripController'
      })
      .when('/login', {
        templateUrl: 'app/auth/login.html',
        controller: 'AuthController'
      })
      .when('/signup', {
        templateUrl: 'app/auth/signup.html',
        controller: 'AuthController'
      })
      .otherwise({
        redirectTo: '/login'
      })
    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
    $httpProvider.interceptors.push('AttachTokens');

  })
  .factory('AttachTokens', function($window) {
    // this is an $httpInterceptor
    // its job is to stop all out going request
    // then look in local storage and find the user's token
    // then add it to the header so the server can validate the request
    var attach = {
      request: function(object) {
        var jwt = $window.localStorage.getItem('com.tp');
        // console.log('JWT', jwt);
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })
  .run(function($rootScope, $location, Auth) {
    // here inside the run phase of angular, our services and controllers
    // have just been registered and our app is ready
    // however, we want to make sure the user is authorized
    // we listen for when angular is trying to change routes
    // when it does change routes, we then look for the token in localstorage
    // and send that token to the server to see if it is a real user or hasn't expired
    // if it's not valid, we then redirect back to signin/signup
    $rootScope.$on('$routeChangeStart', function(evt, next, current) {
      if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
        $location.path('/login');
      }
    });
  });
