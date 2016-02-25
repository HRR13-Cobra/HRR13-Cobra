angular.module('app.new-trip', [])

.controller('new-tripController', function($scope, $location, $window, Trips) {

  $scope.map;
  $scope.geocoder = new google.maps.Geocoder();
  $scope.destination;
  var coordinates = {};

  var createContent = function(info) {
    var string = '';
    if (info.POI.length > 0) {
      info.POI.forEach(function(point) {

        string += '<strong>' + (point.title? point.title: '') + ':</strong> ' + (point.details? point.details: '') + '<br>';
      });
    }
    return string;
  }


  var createMarker = function (info) {
    // console.log(info);
    // console.log(info);
    var marker = new google.maps.Marker({
      map: $scope.map,
      position: info.coordinates,
      destination: info.destination,
      animation: google.maps.Animation.DROP,
    });
    marker.addListener('dblclick', function() {
      console.log('double clicking...');
      Trips.removeTrip(marker.destination);
      marker.setMap(null);
    });
    var infowindow = new google.maps.InfoWindow({
      content: '<a href="http://localhost:3000/#/my-trip/'+info._id+'">'+info.destination+'</a><br>' + 
      createContent(info),
    });
    marker.addListener('click', function(){
      console.log('adding');

      infowindow.open(marker.get('map'), marker);
    })
  }

  $scope.showTrips = function(user) {
    Trips.allTrips(user)
      .then(function(data) {
        $scope.trips = data;

        $scope.trips.forEach(function(trip) {
          // console.log(trip);
          if(trip.coordinates) createMarker(trip);
      });
    });
  };
  
  $scope.showTrips(Trips.user);

  $scope.createTrip = function(destination, startDate, coordinates) {
    Trips.newTrip(destination, startDate, coordinates);
  };


  var mapOptions = {

    // start in USA
    center: new google.maps.LatLng(37.09024, -95.712891),
    zoom: 5
  };

  // create map 
  $scope.map = new google.maps.Map(document.getElementById("mapDiv"), mapOptions);

  $scope.map.addListener('click', function(e) {
    var info = {
      _id: null,
      coordinates: null,
      destination: null,
      POI: [],
    };

    $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+e.latLng.lat()+","+e.latLng.lng()+"&key=AIzaSyCXPMP0KsMOdfwehnmOUwu-W3VOK92CkwI", function(data) {
      
      $scope.destination =  data.results[1].formatted_address;
      coordinates.lat = data.results[0].geometry.location.lat;
      coordinates.lng = data.results[0].geometry.location.lng;
      info.coordinates = data.results[0].geometry.location;
      info.destination = $scope.destination;

      // @Date.now as a placeholder since server requires dates
      Trips.newTrip(info.destination, Date.now(), info.coordinates, function(id) {
        info._id = id;
        createMarker(info);

      });
    });
   })
  $scope.geocodeAddress = function () {
    $scope.geocoder.geocode({'address':$scope.destination},
      function(results, status) {
        var tempInfo;

        // TODO: remove redundant code with add event listener
        if(status === google.maps.GeocoderStatus.OK) {
          $scope.map.setCenter(results[0].geometry.location);
          console.log(results[0]);
          tempInfo = {
            destination: results[0].formatted_address, 
            coordinates: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            },
            POI: [],
          }
          $scope.destination = results[0].formatted_address;
          Trips.newTrip(tempInfo.destination, Date.now(), tempInfo.coordinates, function(data) {
            tempInfo._id = data;
            createMarker(tempInfo);
          })
          $scope.map.setZoom(6);
          $scope.map.panTo(tempInfo.position)
        } else {
          console.log('error')
        }
      });
  }

  $scope.submitForm = function(){
    $scope.geocodeAddress();
  }

});
