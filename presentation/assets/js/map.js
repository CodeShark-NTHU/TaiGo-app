var Map = function() {
  var initialize = function() {
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
    mapControlElement[0].style.margin = "100px 0 0 10px";
  

  }

  return {
    init: initialize
  };
}();

document.addEventListener("DOMContentLoaded", function() {
  Map.init();
});

