
angular.module('app.new-trip', [])

.controller('new-tripController', function($scope, $location, $window, Trips, Auth) {
  $(document).ready(function(){
    $('#locationForm').keypress(function(event) {
      if (event.keyCode === 13 ) {
        console.log('preventing');
        event.preventDefault();
      }
    })
  });

  $scope.signout = function() {
    Auth.signout();
  };

  var mapOptions = {
    // start in USA
    center: new google.maps.LatLng(37.09024, -95.712891),
    zoom: 5
  };

  $scope.map = new google.maps.Map(document.getElementById("mapDiv"), mapOptions);
  $scope.geocoder = new google.maps.Geocoder();
  $scope.destination;
  $scope.marker = null;
  $scope.currentMarkers = [];
  $scope.currentMarkerData = [];
  $scope.buttonTitle = 'hotel';
  $scope.nextQuestion;

  $scope.next = function() {
    $scope.nextQuestion = Object.keys(questionBank)[Object.keys(questionBank).indexOf($scope.buttonTitle)+1];

    searchNearby({
      location: userCoordinates,
      radius: '5000',
      types: [$scope.nextQuestion],
      buttonTitle: $scope.nextQuestion
    });
  }
  $scope.openTab = function(url) {
    console.log('url', url)
    $window.open(url, '_blank');
  }

  // declare one infoWindow to avoid multiple windows
  var infowindow = new google.maps.InfoWindow();
  var assignInfoWindow = function(marker, contentStr) {
    google.maps.event.addListener(marker, 'mouseover', function() {
      infowindow.setContent(contentStr);
      infowindow.open($scope.map, marker);
    });
    google.maps.event.addListener(marker, 'mouseout', function() {
      infowindow.close();
    });
  }
  $scope.syncInfoWindow = function(marker) {
    var syncMarker = $scope.currentMarkers[$scope.currentMarkerData.indexOf(marker)];
    infowindow.setContent(marker.name);
    infowindow.open($scope.map, syncMarker);
  }

  $scope.leaveInfoWindow = function(marker) {
    var syncMarker = $scope.currentMarkers[$scope.currentMarkerData.indexOf(marker)];
    infowindow.close()
  }

  $scope.setBounce = function(marker) {
    console.log(marker);
    var syncMarker = $scope.currentMarkers[$scope.currentMarkerData.indexOf(marker)];
    if (!marker.infomap) {
      syncMarker.setAnimation(null);
    } else {
      syncMarker.setAnimation(google.maps.Animation.BOUNCE);
    }

  }

  var questionBank = {
    hotel: {
      question: 'Please select a hotel below',
      answer: null,
    },
    restaurant: {
      question:'Please select a restaurant below',
      answer: [],
    },
    hasBeenCalled: false,
  };

  $scope.questions = questionBank['hotel'].question;

  var tripData = {
    hotelID: null,
    restaurants: [],
    transportation: null, 
  }

  var displayQuestion = function(type) {
    $scope.questions = questionBank[type].question;
    $('#questionsID').scope().$apply()
  }

  var userCoordinates;

  // @input trip destination only. Nearby POIs use declare markers separately
  var createMarker = function(info) {
    if ($scope.marker) { $scope.marker.setMap(null); }
    // console.log(info.coordinates, 'coordinates');
    var marker = new google.maps.Marker({
      map: $scope.map,
      position: info.coordinates,
      destination: info.destination,
      animation: google.maps.Animation.DROP,
    });

    $scope.marker = marker;

    marker.addListener('click', function() {
      infowindow.setContent(info.destination);
      infowindow.open(marker.get('map'), marker);
    })

    //uses jQuerey to set the value of the destination in the box
    document.getElementById("destination").value = info.destination;
    $('#destination').scope().$apply();

    marker.addListener('dragend', function(){
      document.getElementById("destination").value = $scope.destination;
      $('#destination').scope().$apply();
    })
  };

  var displayMarkersFromYelp = function (array) {
      var coordinates;
      // TODO: pass in pure arrays
      // array.data.businesses.forEach(function(point) {
      array.forEach(function(point) {
      coordinates = {
        lat: point.location.coordinate.latitude,
        lng: point.location.coordinate.longitude,
      };
      var marker = new google.maps.Marker({
        map: $scope.map,
        position: coordinates,
        animation: google.maps.Animation.DROP,
      });

      $scope.map.setZoom(8);
      $scope.map.panTo(coordinates);

      assignInfoWindow(marker, point.name);
      $scope.currentMarkerData.push(point);
      $scope.currentMarkers.push(marker);
      })
      // console.log('current markers: ', $scope.currentMarkers)
  }

  var input = (document.getElementById('destination'));
  //$scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', $scope.map);

  
  var marker = new google.maps.Marker({
    map: $scope.map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {

    if ($scope.marker) { $scope.marker.setMap(null); }
    infowindow.close();
    marker.setVisible(false);

    var place = autocomplete.getPlace();

    userCoordinates = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
    }

    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      $scope.map.fitBounds(place.geometry.viewport);
    } else {
      $scope.map.setCenter(place.geometry.location);
      $scope.map.setZoom(17);  // Why 17? Because it looks good.
    }

    var info = {
      _id: null,
      coordinates: {},
      destination: null,
      googledata: null,
      googleplace: place,
      POI: [],
    };

    info.coordinates.lat = place.geometry.location.lat();
    info.coordinates.lng = place.geometry.location.lng();
    info.destination = place.formatted_address;
    createMarker(info);
    $scope.info = info;
    $scope.destinaiton = info.destination;    
  });

  var clearMarkers = function () {
    $scope.currentMarkers.forEach(function (marker) {
      marker.setMap(null);
    });
  }

  var searchNearby = function (request) {
    clearMarkers();

    var service = new google.maps.places.PlacesService($scope.map);
    service.nearbySearch(request, function (results) {
      // console.log(results);
      results.forEach(function (point) {
        // console.log(point);
        var marker = new google.maps.Marker({
          map: $scope.map,
          position: point.geometry.location,
          icon: {
            url: point.icon,
            scaledSize: new google.maps.Size(25,25)
          },
          animation: google.maps.Animation.DROP,
          place_id: point.place_id,
        });
        $scope.currentMarkerData.push({
          // image_url: point.photos[0].getUrl(),
          name: point.name,
          infomap: false,
          image_url: null,
          url: null,
          location: {
            address: null,
          }
        });
        $('#poiList').scope().$apply();
        

        // console.log($scope.currentMarkerData);
        
        $scope.currentMarkers.push(marker);
        var contentStr = point.name + 
            '<br><button id='+point.place_id+
            '>Select ' + request.buttonTitle + '</button>';

        assignInfoWindow(marker, contentStr);

        google.maps.event.addListener(infowindow, 'domready', function () {
          $('#' + point.place_id).click(function () {
            $scope.buttonTitle = request.buttonTitle;
            
            questionBank[$scope.buttonTitle].answer = point;
            displayQuestion($scope.nextQuestion);

            if ($scope.nextQuestion !== 'hasBeenCalled') {
              $scope.showQuestion = false;

              searchNearby({
                location: userCoordinates,
                radius: '5000',
                types: [$scope.nextQuestion],
                buttonTitle: $scope.nextQuestion
              });
            } else {
              console.log('there are no more questions');
              clearMarkers();
            }
          });
        });

        $scope.map.setZoom(12);
        $scope.map.panTo(request.location)
      });
    });
  }

    // Enables drawing on map
  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: null,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.RECTANGLE,
        google.maps.drawing.OverlayType.POLYLINE,
      ]
    },
    markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
  });
  // listens for a click and renders a marker and returns corresponding address
  $scope.map.addListener('click', function(e) {
    var info = {
      _id: null,
      coordinates: null,
      destination: null,
      googledata: null,
      googleplace: null,
      POI: [],
    };

    var service;

    $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + e.latLng.lat() + "," + e.latLng.lng() + "&key=AIzaSyCXPMP0KsMOdfwehnmOUwu-W3VOK92CkwI", function(data) {
      if (data.status === 'ZERO_RESULTS'){
        alert('please click on land!');
      } else {
        info.coordinates = data.results[0].geometry.location;
        info.destination = data.results[1].formatted_address;
        info.googledata = data;
        createMarker(info);
        $scope.info = info;
        $scope.destination = info.destination;
        $('#destination').scope().$apply();
        // search nearby, will need to recall when question changes
        userCoordinates = new google.maps.LatLng(info.coordinates.lat, info.coordinates.lng);

      }
    });
  });
  
  $scope.getAttractions = function () {
    clearMarkers();
    $scope.destination = document.getElementById("destination").value;
    Trips.requestAttractions($scope.destination)
    .then(function (results) {
      displayMarkersFromYelp(results.data.businesses);
    })
    .catch(function(err){
      console.error(err);
    });
  }  

  $scope.quickAdd = function () {
    $scope.showQuestion = true;
    if (!questionBank.hasBeenCalled) {
      // console.log(userCoordinates)
      searchNearby({
        location: userCoordinates,
        radius: '5000',
        types: ['lodging'],
        buttonTitle: 'hotel',
      })
      questionBank.hasBeenCalled = true;
    }
  }



  google.maps.event.addListener(drawingManager, 'polylinecomplete', function(event) {
    console.log(event);
    // get 10 requests per line
    console.log(event.getPath().getArray().toString());
    var fromPoint = [event.getPath().getArray()[0].lat(), event.getPath().getArray()[0].lng()];
    var toPoint = [event.getPath().getArray()[1].lat(), event.getPath().getArray()[1].lng()]
    var latIncrement = (toPoint[0] - fromPoint[0]) / 10;
    var lngIncrement = (toPoint[1] - fromPoint[1]) / 10;
    // generate ten points in this line
    var tenPoints = [];
    var count = 1;
    var yelpResults = [];
    while (count < 10) {
      tenPoints.push([fromPoint[0] + latIncrement * count, fromPoint[1] + lngIncrement * count])
      count++;
    }
    Trips.searchOverlay(tenPoints)
    .then(function(results) {
      console.log(results);
      results.data.forEach(function(obj) {
        yelpResults.push(obj.businesses[0]);
      });
      displayMarkersFromYelp(yelpResults);
    })
    .catch(function(err) {
      console.error(err);
    });
});  
  google.maps.event.addListener(drawingManager, 'rectanglecomplete', function(event) {
    var rectCoordinates = event.getBounds()
      .toString()
      .replace(/[()]/g, '')
      .split(',')
      .map(function(val){
        return Number(val)
      });
    Trips.searchOverlay(rectCoordinates)
    .then(function(results) {
      console.log(results);
      displayMarkersFromYelp(results.data.businesses);
    })
    .catch(function(err){
      console.error(err);
    });
});
  
  drawingManager.setMap($scope.map);

  $scope.geocodeAddress = function() {
    $scope.geocoder.geocode({
        'address': $scope.destination
      },
      function(results, status) {
        var tempInfo;

        // TODO: remove redundant code with add event listener
        if (status === google.maps.GeocoderStatus.OK) {
          $scope.map.setCenter(results[0].geometry.location);
          tempInfo = {
            destination: results[0].formatted_address,
            coordinates: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            },
            POI: [],
          }
          console.log('tempinfo', tempInfo.coordinates);
          $scope.destination = results[0].formatted_address;
          Trips.newTrip(tempInfo.destination, $scope.startDate, tempInfo.coordinates, function(data) {
            tempInfo._id = data;
            createMarker(tempInfo);
          })
          $scope.map.setZoom(6);
          $scope.map.panTo(tempInfo.position)
        } else {
          console.log('error')
        }
      });
    };

  $scope.createTrip = function() {
    var selectedPOI = [];
    Trips.newTrip($scope.info.destination, $scope.startDate, $scope.info.coordinates)
      .then(function(tripID) {
        // add all selected 
        $scope.currentMarkerData.forEach(function(poi, i) {
          if (poi.infomap) {
            Trips.addPOI(tripID, poi.name,
              '<img src=' + poi.image_url + '>' +
              '<a href='+poi.url+'>link/a><br>' +
              poi.location.address);
          }
        });
        $location.path('/my-trip/' + tripID);
      });
  };

  $scope.selectPOI = function (POI) {
    console.log('selecting ' + POI);
  }
});