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

    // Markers
	/*this.map.on('style.load', function() {
		this.map.addSource("markers", {
			"type": "geojson",
			"data": {
				"type": "FeatureCollection",
				"features": [{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [coord.lng(), coord.lat()]
					},
					"properties": {
						"title": "Ipsum",
						'marker-color': '#3bb2d0',
            'marker-size': 'large',
            'marker-symbol': 'rocket'
					}
				}, {
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [coord.lng(), coord.lat()]
					},
					"properties": {
						"title": "Ipsum",
						'marker-color': '#3bb2d0',
            'marker-size': 'large',
            'marker-symbol': 'rocket'
					}
				}]
			}
		});

		this.map.addLayer({
			"id": "markers",
			"type": "symbol",
			"source": "markers",
			"layout": {
				"icon-image": "{marker-symbol}",
				"text-field": "{title}",
				"text-font": "Open Sans Semibold, Arial Unicode MS Bold",
				"text-offset": [0, 0.6],
				"text-anchor": "top"
			},
			"paint": {
				"text-size": 14
			}
		});
	}); */

    
    /*var pos = new mapboxgl.LngLat(coord.lng(), coord.lat());

    new mapboxgl.Marker()
    .setLngLat(pos)
    .addTo(this.map);  */

   /* var markerSource = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [coord.lng(), coord.lat()]
      },
      properties: {
        title: 'Mapbox SF',
        description: '155 9th St, San Francisco',
        'marker-color': '#3bb2d0',
        'marker-size': 'large',
        'marker-symbol': 'rocket'
      }

    };
    var _this = this;

    _this.map.addSource('destMarker', markerSource);

    map.addLayer({
			"id": "destMarker",
			"type": "symbol",
			"source": "markers",
			"layout": {
				"icon-image": "{marker-symbol}",
				"text-field": "{title}",
				"text-font": "Open Sans Semibold, Arial Unicode MS Bold",
				"text-offset": [0, 0.6],
				"text-anchor": "top"
			},
			"paint": {
				"text-size": 14
			}
		}); */


    /*new mapboxgl.Marker()
    .setLngLat(marker.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
    .addTo(map)*/

    var _this = this;

    // create a HTML element for each feature
    var el = document.createElement('div');
    el.innerHTML = '<div class="pin"></div>';

    new mapboxgl.Marker(el)
    .setLngLat([coord.lng(), coord.lat()])
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML('<h3>' +"Stuff"+ '</h3><p>' + "Stuff" + '</p>'))
    .addTo(_this.map);

    console.log("Should add marker!");
    //this.map.addSource(marker); */



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

