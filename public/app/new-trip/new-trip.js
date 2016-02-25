angular.module('app.new-trip', [])

.controller('new-tripController', function($scope, $location, $window, Trips) {

  $scope.trip = {};
  $scope.map;
  $scope.geocoder = new google.maps.Geocoder();
  $scope.markers = [];
  $scope.destination;

  // $scope.getTripData = function(destination, startDate){
  //   Trips.newTrip(destination, startDate)
  //     .then(function(response){
  //       $scope.trip = response;
  //       console.log($scope.trip)
  //     })
  // }


  $scope.createTrip = function(destination, startDate) {
  	// console.log($window.localStorage.getItem('com.tp'));

    Trips.newTrip(destination, startDate);

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
      $scope.destination = data.results[1].formatted_address;

      var req = {
        // FIXME: server side is not receiving trip information
        token: window.localStorage.getItem('com.tp'),
        destination: $scope.destination,
      }

      // @Date.now as a placeholder since server requires dates
      Trips.newTrip($scope.destination, Date.now());
  
      // place marker
      var marker = new google.maps.Marker({
        map: $scope.map,
        // FIXME: address does not update after dropping marker
        draggable: true,
        position:data.results[0].geometry.location,
        animation: google.maps.Animation.DROP
      });
        $scope.markers.push($scope.destination);
    });
   })
  $scope.geocodeAddress = function () {
    console.log('scope', $scope.destination);
    $scope.geocoder.geocode({'address':$scope.destination},
      function(results, status) {
        // TODO: remove redundant code with add event listener
        if(status === google.maps.GeocoderStatus.OK) {
          $scope.map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: $scope.map,
            position: results[0].geometry.location,
          });
          console.log(results)
          $scope.destination = results[0].formatted_address;
          $scope.map.setZoom(6);
          $scope.map.panTo(marker.position)
        } else {
          console.log('error')
        }
      });
  }

  $scope.submitForm = function(){
    $scope.geocodeAddress();
    $scope.createTrip($scope.destination, Date.now());
  }
});
