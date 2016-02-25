angular.module('app.new-trip', [])

.controller('new-tripController', function($scope, $location, $window, Trips) {

  $scope.trip = {};
  $scope.map;
  $scope.geocoder = new google.maps.Geocoder();
  $scope.markers = {};
  $scope.address;

  // $scope.getTripData = function(destination, startDate){
  //   Trips.newTrip(destination, startDate)
  //     .then(function(response){
  //       $scope.trip = response;
  //       console.log($scope.trip)
  //     })
  // }


  $scope.createTrip = function(destination, startDate) {
  	// console.log($window.localStorage.getItem('com.tp'));
    Trips.newTrip(destination, startDate)
      .then(function(response) {
      // 	console.log(response);
      // 	var tripID = response.data._id;
      // 	$location.path('/trips/' + tripID)
      // })
      	console.log('response from node',response);
        console.log("DATE", startDate);
        $location.path('/my-trip/' + response.data);
      	// console.log(response);
      	// var tripID = response.data._id;
      	// $location.path('/trips/' + tripID)
      });
      // 	console.log('response from node',response);
      //   $location.path('/my-trip/' + response.data);
      // });

      // .then(function() {
      //   var id = $scope.trip.data._id
      //   console.log(id);
      // // 	var tripID = response.data.trips.pop()._id;
      // //   console.log(tripID);
		    // // $location.path('/#/my-trip/' + tripID);
      // })
  };

  var mapOptions = {
        // start in USA
    center: new google.maps.LatLng(37.09024, -95.712891),
    zoom: 5
  };
  $scope.map = new google.maps.Map(document.getElementById("mapDiv"), mapOptions);
  $scope.map.addListener('click', function(e) {
        $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+e.latLng.lat()+","+e.latLng.lng()+"&key=AIzaSyCXPMP0KsMOdfwehnmOUwu-W3VOK92CkwI", function(data) {
          console.log(data);
          address = data.results[1].formatted_address;

          var req = {
            // FIXME: server side is not receiving trip information
            token: window.localStorage.getItem('com.tp'),
            destination: address,
          }
          console.log(address);
          $.ajax('http://localhost:3000/api/trips/create', {
            'data': JSON.stringify(req),
            'type': 'POST',
            'processData': false,
            'contentType': 'application/json'
          })
          // place marker
          var marker = new google.maps.Marker({
            map: $scope.map,
            // FIXME: address does not update after dropping marker
            draggable: true,
            position:data.results[0].geometry.location,
            animation: google.maps.Animation.DROP
          });
            $('#userList').append($('<li>'+address+'</li>'))
        });


   })
});
