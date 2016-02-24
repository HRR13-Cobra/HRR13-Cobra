  // TODO: fix global variable
  var map;
  var geocoder = new google.maps.Geocoder();
  var markers = {};
  var address;
  function initialize() {
      var mapOptions = {
        // start in USA
        center: new google.maps.LatLng(37.09024, -95.712891),
        zoom: 5
      };
      map = new google.maps.Map(document.getElementById("mapDiv"), mapOptions);
      map.addListener('click', function(e) {
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
            map: map,
            // FIXME: address does not update after dropping marker
            draggable: true,
            position:data.results[0].geometry.location,
            animation: google.maps.Animation.DROP
          });
            $('#userList').append($('<li>'+address+'</li>'))
        });


   })
  }
    
    google.maps.event.addDomListener(window, 'load', initialize);
    // enable reverse look up from readable address to latLng
    function geocodeAddress() {
      var address = document.getElementById("address").value;
      geocoder.geocode({'address':address},
        function(results, status) {
          // TODO: remove redundant code with add event listener
          if(status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
            });
            console.log(results)
            map.setZoom(6);
            map.panTo(marker.position)
          } else {
            console.log('error')
          }
        });
    }

    // TODO: finish removing marker
    // http://stackoverflow.com/questions/8521766/google-maps-api-3-remove-selected-marker-only
    // function delMarker(id) {
    //   marker = markers[id];
    //   marker.setMap(null);
    // }
