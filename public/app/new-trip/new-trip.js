
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

  // declare one infoWindow to avoid multiple windows
  var infowindow = new google.maps.InfoWindow();
  var assignInfoWindow = function(marker, contentStr) {
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(contentStr);
      infowindow.open($scope.map, marker);
    })
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
    transportation: {
      question: 'Have you arranged your transportations?',
      answer: null
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
    console.log(info.coordinates, 'coordinates');
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

  ////////////////// STOP STOP STOP STOP STOP ///////////////////////////
  ////////////////// STOP STOP STOP STOP STOP ///////////////////////////
  ////////////////// STOP STOP STOP STOP STOP ///////////////////////////

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

  ////////////////// STOP STOP STOP STOP STOP ///////////////////////////
  ////////////////// STOP STOP STOP STOP STOP ///////////////////////////
  ////////////////// STOP STOP STOP STOP STOP ///////////////////////////

  var clearMarkers = function () {
    $scope.currentMarkers.forEach(function (marker) {
      marker.setMap(null);
    });
  }

  var searchNearby = function (request) {
    clearMarkers();

    var service = new google.maps.places.PlacesService($scope.map);
    service.nearbySearch(request, function (results) {
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

        $scope.currentMarkers.push(marker);
        var contentStr = point.name + 
            '<br><button id='+point.place_id+
            '>Select ' + request.buttonTitle + '</button>';

        assignInfoWindow(marker, contentStr);

        google.maps.event.addListener(infowindow, 'domready', function () {
          $('#' + point.place_id).click(function () {
            var buttonTitle = request.buttonTitle;
            var nextQuestion = Object.keys(questionBank)[Object.keys(questionBank).indexOf(buttonTitle)+1];
            questionBank[buttonTitle].answer = point;
            displayQuestion(nextQuestion);

            if (nextQuestion !== 'hasBeenCalled') {
              $scope.showQuestion = false;

              searchNearby({
                location: userCoordinates,
                radius: '5000',
                types: [nextQuestion],
                buttonTitle: nextQuestion
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

      results.data.businesses.forEach(function(point) {
        console.log(point);
        var shape = {
          coords: [1, 1, 1, 20, 18, 20, 18, 1],
          type: 'poly'
        };
        var coordinates = {
          lat: point.location.coordinate.latitude,
          lng: point.location.coordinate.longitude,
        };
        var marker = new google.maps.Marker({
          map: $scope.map,
          position: coordinates,
          icon: {
            url: 'https://cdn2.iconfinder.com/data/icons/smiled-map-markers/512/retired_marker_pointer_position_emotion_emoticon_smile-512.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            scaledSize: new google.maps.Size(40, 40)
            },
          animation: google.maps.Animation.DROP,
        });

        assignInfoWindow(marker, point.name);
        $scope.currentMarkers.push(marker);
      })
    })
    .catch(function(err){
      console.error(err);
    });
  }  
  $scope.quickAdd = function () {
    $scope.showQuestion = true;
    if (!questionBank.hasBeenCalled) {
      searchNearby({
        location: userCoordinates,
        radius: '5000',
        types: ['lodging'],
        buttonTitle: 'hotel',
      })
      questionBank.hasBeenCalled = true;
    }
  }

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
    Trips.newTrip($scope.info.destination, $scope.startDate, $scope.info.coordinates)
      .then(function(tripID) {
        Object.keys(questionBank).forEach(function (key) {
          if (questionBank[key].answer) {
            Trips.addPOI(tripID, key, questionBank[key].answer.name + ' @ ' + questionBank[key].answer.vicinity);
          }
        })
        $location.path('/my-trip/' + tripID);
      });
  };

});