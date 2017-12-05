var UI = function() {
  var _initalize = function() {
    
    var searchForm = document.getElementById('search-container')

    searchForm.onsubmit = function(e){
      e.preventDefault();

      var address = searchForm.search_input.value;
      Map.geocodeAddress(address, _renderGeocodeAddress);

    };
  }
  /*
    Options:
    @title: string
    @desc: string
  */
  var _generatePopupTemplate = function(options){
    _.defaults(options, {desc: ""});
    var template = function(html) { return '<div class="markerPopup">' + html + '</div>' };
    var title = '<div class="title">' + options.title + '</div>';
    var body = '<div class="body">' + options.desc + '</div>'

    return template(title + body);
  }

  var _renderGeocodeAddress = function(result){
    if(result.length > 0) {
      console.log(result);
      var data = result[0];
      var location = data.geometry.location;

      Map.getPlaceDetails(data.place_id, function(place,status){
        if(status){
          var popup = _generatePopupTemplate({title: place.name, desc: data.formatted_address});
          Map.addMarker({
            coord: [location.lng(), location.lat()],
            popupTemplate: popup
          });
        } else {
          console.log("Could not find place details");
        }
      });

    

    } else {
      alert("No location found!");
    }
  }
  

 

  return {
    init: _initalize,
    generatePopupTemplate: _generatePopupTemplate
  };
}();

document.addEventListener("DOMContentLoaded", function() {
  UI.init();
});