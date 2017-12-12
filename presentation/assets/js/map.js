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
    this.userMarker = undefined;
    this.destMarker = undefined;
   
  }


  var _setUserMarker = function(userCoords, popup) {
    if(_.isUndefined(this.userMarker)) {
      this.userMarker = this.addMarker({
        coord: userCoords,
        color: "#2196F3",
        popupTemplate: popup
      });  

      Map.map.flyTo({
        center: userCoords,
        zoom: 14
      });
    } else {
      this.userMarker.setLngLat(userCoords);
    }
   
  };

  var _getUserMarker = function() {
    return this.userMarker;
  };

  var _setDestinationMarker = function(coords, popup){
    if(_.isUndefined(this.destMarker)){
      
      this.destMarker = Map.addMarker({
        coord: coords,
        popupTemplate: popup
      });

    } else {
      this.destMarker.setLngLat(coords);
    }
  };

  var _getDestinationMarker = function() {
    return this.destMarker;
  };

  /*
    Options: 
    @coord: [lng,lat]
    @color: hex color optional
    @popupTemplate: html optional
  */
  var _addMarker = function(options){

    var _this = this;
    _.defaults(options, {color: "#89849b", popupTemplate: ""});

    // create a HTML element for each feature - TODO: MOVE TO UI.js
    var el = document.createElement('div');
    el.innerHTML = '<div style="background: '+ options.color + ';"  class="pin"></div>';

    marker = new mapboxgl.Marker(el)
    .setLngLat(options.coord)
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML(options.popupTemplate) )
    .addTo(_this.map);

    return marker;
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
        callback(results);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
  /*
    @pointArry: array of [lng, lat]
  */
  var _generateLineString = function(pointArr){
    var geojson = {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "geometry": {
              "type": "LineString",
              "properties": {},
              "coordinates": pointArr
          }
      }]
    };

    return geojson;
  }
  /*
    options:
      @geoJson: json
      @color: hexcolor string 
      @width: int
  */
  var _drawLine = function(options){

  }

  return {
    init: _initialize,
    geocodeAddress: _geocodeAddress,
    addMarker: _addMarker,
    getPlaceDetails: _getPlaceDetails,
    setUserMarker: _setUserMarker,
    getUserMarker: _getUserMarker,
    setDestinationMarker: _setDestinationMarker,
    getDestinationMarker: _setDestinationMarker
  };

}();

document.addEventListener("DOMContentLoaded", function() {
  Map.init();
});

