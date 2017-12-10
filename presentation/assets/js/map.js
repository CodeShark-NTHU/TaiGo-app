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

    this.geocoder = new google.maps.Geocoder();
    this.placeService = new google.maps.places.PlacesService(document.createElement('div'));

   
  }
  /*
    Options: 
    @coord: [lng,lat]
    @color: hex color optional
    @popupTemplate: html optional
  */
  var _addMarker = function(options){

    var _this = this;
    _.defaults(options, {color: "#89849b", popupTemplate: ""});

    // create a HTML element for each feature
    var el = document.createElement('div');
    el.innerHTML = '<div style="background: '+ options.color + ';"  class="pin"></div>';

    new mapboxgl.Marker(el)
    .setLngLat(options.coord)
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML(options.popupTemplate) )
    .addTo(_this.map);
  }


  var _getPlaceDetails = function(placeID, callback) {
    this.placeService.getDetails({
      placeId: placeID
    }, function(place, status) {
      myStatus = status === google.maps.places.PlacesServiceStatus.OK
      callback(place, myStatus)
    });
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
    addMarker: _addMarker,
    getPlaceDetails: _getPlaceDetails 
  };
}();

document.addEventListener("DOMContentLoaded", function() {
  Map.init();
});

