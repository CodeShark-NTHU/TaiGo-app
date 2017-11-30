var UI = function() {
  var _initalize = function() {

   /* $('.item-list').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: false,
      width: 200,
      responsive: true,
      touchMove: true,
      variableWidth: true
    });
    */
    /*
    var geocoderInput = $(".mapboxgl-ctrl-geocoder.mapboxgl-ctrl > input");
    geocoderInput.addClass("browser-default");

    //UI Hack
    $(".mapboxgl-ctrl-top-right").attr("id", "search-container");
    var searchContainer = $("#search-container");
    searchContainer.removeClass("mapboxgl-ctrl-top-right");

    var mapboxGeocoder = $(".mapboxgl-ctrl-geocoder");
    $(".geocoder-icon.geocoder-icon-search").remove(); //removes the default icon that mapbox gecoder generates
    
    var menuBtnHtml = '<a id="hamburger-menu" href="#"><i class="material-icons">menu</i></a>'; 
    mapboxGeocoder.prepend(menuBtnHtml); //inject menu icon in search container */
    
    var searchForm = document.getElementById('search-container')

    searchForm.onsubmit = function(e){
      e.preventDefault();

      var address = searchForm.search_input.value;

      Map.geocodeAddress(address, function(r){
        if(r.length > 0) {
          console.log(r);
          var location = r[0].geometry.location;
          Map.addMarker(location);
        } else {
          alert("No location found!");
        }
      });

    };
    
  
  }
  

 

  return {
    init: _initalize
  };
}();

document.addEventListener("DOMContentLoaded", function() {
  UI.init();
});