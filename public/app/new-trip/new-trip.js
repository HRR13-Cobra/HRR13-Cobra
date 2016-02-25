angular.module('app.new-trip', [])

.controller('new-tripController', function($scope, $location, $window, Trips) {

  $scope.map;
  $scope.geocoder = new google.maps.Geocoder();
  $scope.destination;
  // var allTrips;
  var coordinates = {};

  // var createContent = function(info) {
  //   var template = $('<div></div>');
  //   info.POI.forEach(function(point){
  //     if(point.title && point.detail){
  //       template.append('<h4>'+point.title+'</h4>'+'<li>'+point.detail+'</li>');
  //       console.log(template);
  //     }
  //   });
  //   return $(template);
  // }

  var createMarker = function (info) {
    // console.log(info);
    var marker = new google.maps.Marker({
      map: $scope.map,
      position: info.coordinates,
      destination: info.destination
    });
    marker.addListener('dblclick', function() {
      console.log('double clicking...');
      Trips.removeTrip(marker.destination);
      marker.setMap(null);
    });
    var infowindow = new google.maps.InfoWindow({
      content: '<a href="http://localhost:3000/#/my-trip/'+info._id+'">'+info.destination+'</a>',
    });
    marker.addListener('click', function(){
      infowindow.open(marker.get('map'), marker);
    })
  }

  $scope.showTrips = function(user) {
    Trips.allTrips(user)
      .then(function(data) {
        $scope.trips = data;
        console.log($scope.trips);
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
    };

    $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+e.latLng.lat()+","+e.latLng.lng()+"&key=AIzaSyCXPMP0KsMOdfwehnmOUwu-W3VOK92CkwI", function(data) {
      
      $scope.destination =  data.results[1].formatted_address;
      coordinates.lat = data.results[0].geometry.location.lat;
      coordinates.lng = data.results[0].geometry.location.lng;
      info.coordinates = data.results[0].geometry.location;
      info.destination = $scope.destination;
      // var req = {
      //   // FIXME: server side is not receiving trip information
      //   token: window.localStorage.getItem('com.tp'),
      //   destination: $scope.destination,
      // }

      // @Date.now as a placeholder since server requires dates
      Trips.newTrip(info.destination, Date.now(), info.coordinates, function(id) {
        info._id = id;
        createMarker(info);

      });
      // place marker
      // var marker = new google.maps.Marker({
      //   map: $scope.map,
      //   // FIXME: address does not update after dropping marker
      //   // draggable: true,
      //   position:data.results[0].geometry.location,
      //   animation: google.maps.Animation.DROP
      // });
    });
   })
  $scope.geocodeAddress = function () {
    $scope.geocoder.geocode({'address':$scope.destination},
      function(results, status) {
        var tempInfo;
        // TODO: remove redundant code with add event listener
        if(status === google.maps.GeocoderStatus.OK) {
          $scope.map.setCenter(results[0].geometry.location);
          tempInfo = {
            destination: $scope.destination, 
            position: results[0].geometry.location
          }
          createMarker(tempInfo);
          var marker = new google.maps.Marker({
            map: $scope.map,
            position: results[0].geometry.location,
          });
          coordinates.lat = results[0].geometry.location.lat();
          coordinates.lng = results[0].geometry.location.lng();
          $scope.destination = results[0].formatted_address;
          $scope.createTrip($scope.destination, Date.now(), coordinates)
          $scope.map.setZoom(6);
          $scope.map.panTo(marker.position)
        } else {
          console.log('error')
        }
      });
  }

  $scope.submitForm = function(){
    $scope.geocodeAddress();
    // $scope.createTrip($scope.destination, Date.now());
  }


});
