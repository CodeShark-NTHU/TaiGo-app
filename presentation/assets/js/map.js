var Map = function() {
  var _initialize = function() {
    var access_token = "pk.eyJ1IjoicHJvZG94eCIsImEiOiJjamFjYzM1MGYxZzZrMzNudTFoYmp4cXN4In0.fDeon8IaR7QXPZT-JqZScQ";
    mapboxgl.accessToken = access_token;
    var defaultCenter = [120.98842664533413, 24.804349124963082];
    var defaultZoom = 13;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/prodoxx/cjacbqi8b45n42so9046i5fmg',
      center: defaultCenter,
      zoom: defaultZoom
    });

    // Configure and Add Map Navigation Controls
    var nav = new mapboxgl.NavigationControl();
    this.map.addControl(nav, 'top-left');
    var mapControlElement = document.getElementsByClassName('mapboxgl-ctrl');
    mapControlElement[0].style.margin = "100px 0 0 12px";

    //Initialize Geocoder
    /*this.geocoder = new MapboxGeocoder({
      accessToken: access_token,
      zoom: 16,
      country: "tw",
      types: "postcode,district,place,locality,neighborhood,address,poi"
    });
    
    this.map.addControl(this.geocoder); */

    this.geocoder = new google.maps.Geocoder();

   
  }

  var _addMarker = function(coord){
    /*var marker = {
      "type": "Feature",
      "properties": {
        "marker-color": "#7f201e",
        "marker-size": "medium",
        "marker-symbol": "music",
        "type": "journey-step",
        "previous": "1",
        "current": "2",
        "next": "3"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [coord.lat,
          cord.lng
        ]
      }
    }; */
    
    var pos = new mapboxgl.LngLat(coord.lng(), coord.lat());

    new mapboxgl.Marker()
    .setLngLat(pos)
    .addTo(this.map); 



  }

  var _geocodeAddress = function(address, callback) {
    this.geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        /*resultsMap.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        }); */
        callback(results);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }



  return {
    init: _initialize,
    geocodeAddress: _geocodeAddress,
    addMarker: _addMarker
  };
}();

document.addEventListener("DOMContentLoaded", function() {
  Map.init();
});

