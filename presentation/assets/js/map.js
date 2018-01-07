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



    this.map.on('load', function () {
      console.log("Map loaded");
      UI.shouldDisplayElement("#loading_screen", false);
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
    this.busStopMarkers = [];
    this.mapLines = [];
    this.busMarkers = [];



   
  };

  var _findBusMarkerIndex = function(id){
    var ids = _.pluck(this.busMarkers, 'id');
    return _.indexOf(ids, id);
  }

  var _busMarkerExists = function(id){
    return this._findBusMarkerIndex(id) != -1;
  }

  var _updateBusLocation = function(id, coordinates) {
    var result = this.findBusMarkerIndex(id);

    if(result != -1) {
      this.busMarkers[result].marker.setLngLat([coordinates.longitude, coordinates.latitude]);    
      return true;
    } else {
      return false;
    }
  };

  var _removeAllBusStops = function() {
    _.each(this.busStopMarkers, function(marker, i){
      marker.remove();
    });
    this.busStopMarkers = [];
  };

  var _removeAllBuses = function() {
    _.each(this.busMarkers, function(v, i){
      v.marker.remove();
    });
    this.busMarkers = [];
  };

  var _addBusStopMarker = function(coords, markerType, popup){
    var marker = this.addMarker({
      coord: coords,
      popupTemplate: popup,
      markerElem: markerType
    });  

    this.busStopMarkers.push(marker);
  };

  var _addBusMarker = function(data, markerType, popup){
  
    coordinates = [data.coordinates.longitude, data.coordinates.latitude]
    var marker = this.addMarker({
      coord: coordinates,
      popupTemplate: popup,
      markerElem: markerType
    });  

    this.busMarkers.push({id: data.plate_numb, marker: marker});
   
    
  };
  
  
  var _setUserMarker = function(userCoords, markerType, popup) {
    if(_.isUndefined(this.userMarker)) {
      this.userMarker = this.addMarker({
        coord: userCoords,
        popupTemplate: popup,
        markerElem: markerType
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

  

  var _setDestinationMarker = function(coords, popup, markerType){
    if(_.isUndefined(this.destMarker)){
      
      this.destMarker = Map.addMarker({
        coord: coords,
        popupTemplate: popup,
        color: "#FF5252"
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
    @markerElem: html element [optional]
  */
  var _addMarker = function(options){

    var _this = this;

    var defaultEl = document.createElement('div');

    if(_.isUndefined(options.color)){
      options.color = "#89849b";
    } 

    defaultEl.innerHTML = '<div style="background:' + options.color + '";  class="pin"></div>';

    _.defaults(options, { popupTemplate: "", markerElem: defaultEl });


    // create a HTML element for each feature - TODO: MOVE TO UI.js
   // options.markerElem.style.color = options.color;
    marker = new mapboxgl.Marker(options.markerElem)
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
      @id: string [required]
      @geoJson: json [required]
      @errorCallback: function 
      @type: 'line', 'dashed', 'circle' [options, default = 'line']
      @lineColor: hexcolor string 
      @fitBounds: boolean [default: true]
      @lineWidth: int
  */
  var _drawLine = function(options){
  
      _.defaults(options, {type: 'line',lineColor: "#BF93E4", lineWidth:  5, errorCallback: function() { }, fitBounds: true });

      if(_.isUndefined(options.id) || _.isUndefined(options.geoJson)){
        options.errorCallback();
        console.log("Some error");
      } else {
        var type = '';
        var paint  = undefined;

        if(options.type == 'dashed'){
          type = 'line';
          paint = {
            'line-color': options.lineColor,
            'line-width': options.lineWidth,
            'line-dasharray': [2, 1],
          }
        } else {
          type = options.type;

          switch(type){
            case 'line':
              paint = {
                "line-color": options.lineColor,
                "line-width": options.lineWidth
              }
              break;
            case 'circle':
              paint = {
                'circle-color': options.lineColor,
                'circle-radius': 3, // Make another key for options - TODO
              }
              break;
          }
        }
        
       
        this.map.addLayer({
          "id": options.id,
          "type": type,
          "source": {
              "type": "geojson",
              "data": options.geoJson
          } /*,
          "layout": {
              "line-join": "round",
              "line-cap": "round"
          } */,
          "paint": paint
        });

        var coordinates = options.geoJson.features[0].geometry.coordinates;

       /* var bounds = coordinates.reduce(function(bounds, coord) {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0],coordinates[0])); */

        /*
        this.map.fitBounds(bounds , {
            padding: 50
        });  */

        this.mapLines.push({id: options.id, coordinates: coordinates});
      }

  };

  var _fitCurrentBounds = function() {
    var coords = _.map(this.mapLines, function(v){ return v.coordinates; });
    var allCoordinates = [];

    _.each(coords, function(v,i,l){
      _.each(v, function(v1,i1,l1){
        allCoordinates.push(v1);
      });
    });

    var bounds = allCoordinates.reduce(function(bounds, coord) {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(0,0));

    this.map.fitBounds(bounds , {
      padding: 50
    }); 

  };

  var _hasLines = function() {
    return this.mapLines.length > 0;
  }

  var _removeLine = function(id){
    this.map.removeLayer(id);
  };

  var _removeAllLines = function() {
    var _this = this;
    _.each(this.mapLines, function(v,i,l){
      _this.removeLine(v.id);
    });

    this.mapLines = [];
  };

  return {
    init: _initialize,
    geocodeAddress: _geocodeAddress,
    addMarker: _addMarker,
    getPlaceDetails: _getPlaceDetails,
    setUserMarker: _setUserMarker,
    getUserMarker: _getUserMarker,
    setDestinationMarker: _setDestinationMarker,
    getDestinationMarker: _setDestinationMarker,
    generateLineString: _generateLineString,
    drawLine: _drawLine,
    removeLine: _removeLine,
    removeAllLines: _removeAllLines,
    removeAllBusStops: _removeAllBusStops,
    removeAllBuses: _removeAllBuses,
    fitCurrentBounds: _fitCurrentBounds,
    addBusStopMarker: _addBusStopMarker,
    hasLines: _hasLines,
    addBusMarker: _addBusMarker,
    updateBusLocation: _updateBusLocation,
    findBusMarkerIndex: _findBusMarkerIndex,
    busMarkerExists: _busMarkerExists
  };

}();

document.addEventListener("DOMContentLoaded", function() {
  Map.init();
});

