var UI = function() {
  
  var _initalize = function() {
   // _shouldDisplayElement('#trip-info-container', false);
    this.searchForm = document.getElementById('search-container')
  
    var _this = this;

    this.searchForm.onsubmit = function(e){
      e.preventDefault();
      var address = _this.searchForm.search_input.value;
      Map.geocodeAddress(address, _renderGeocodeAddress);

    };

    //starts listening for user location
    User.startUserLocationWatch(function(data){
      //handle success
      var userCoords = [data.coords.longitude, data.coords.latitude];
      
      //updates user marker
      Map.setUserMarker(userCoords, _generatePopupTemplate({title: "User", desc: "You're here now."}));
      
    }, function(error) {
      //handle failure here.
      //add modal or message at the bottom UI here - TODO
      alert("ERROR: " + User.getErrorMessage(error));
    });
   
  }

  var _clearSearchResults = function() {
    var searchInput = document.getElementById('search-input');
    searchInput.value = "";
    _shouldDisplayElement('#trip-info-container', false);

    //remove all markers. - TODO

  };

  var _searchInputActions = function() {
    var searchInput = document.getElementById('search-input');
    var val = searchInput.value.trim();

    if(val.length == 0){
      //_shouldDisplayElement('#trip-info-container', false);
      _shouldDisplayElement('#search-cancel', false);
    } else {
      //_shouldDisplayElement('#trip-info-container', true);
      _shouldDisplayElement('#search-cancel', true);
    }

    console.log("change");
  };


  
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

  var _shouldDisplayElement = function(elem, cond){
    if(cond)
      $(elem).show();
    else
      $(elem).hide();

  }

  var _renderGeocodeAddress = function(result){
    if(result.length > 0) {
      console.log(result);
      var data = result[0];
      var location = data.geometry.location;

      //Get place information about destination
      Map.getPlaceDetails(data.place_id, function(place,status){
        if(status){
          var popup = _generatePopupTemplate({title: place.name, desc: data.formatted_address});
          var destCoords = [location.lng(), location.lat()];
          //add marker
          Map.setDestinationMarker( destCoords, popup);

          var userCoords = User.getUserLocation();
          console.log("user: " + JSON.stringify(userCoords));
          console.log("dest: " + JSON.stringify(destCoords));

          if(!_.isUndefined(userCoords)){
            
           // var bbox =  new mapboxgl.LngLatBounds([[userCoords.lng, userCoords.lat], destCoords]);
            try {
              var bbox = [[userCoords.lng, userCoords.lat], destCoords]
            ; 

             /* Map.map.fitBounds(bbox.getCenter(), {
                padding: {top: 50, bottom:50, left: 660, right: 660}
              }); */
              Map.map.flyTo({
                center: destCoords
              }); 
            }
            catch(err){
             console.log(err);
            }
           
          } else {
            //show some UI error message. 
          }

          //update place title
          _updatePlaceNameTitle(place.name);

          //display trip info
          _shouldDisplayElement('#trip-info-container', true);

        } else {
          console.log("Could not find place details");
        }
      });


      //get top 3 nearest stops to user which are in the same subroute as destination

    

    } else {
      alert("No location found!");
    }
  }

  var _updatePlaceNameTitle = function(place_name){
    var placeEl = document.getElementById('place-title');
    placeEl.innerText = place_name;
  }
  
  return {
    init: _initalize,
    generatePopupTemplate: _generatePopupTemplate,
    updatePlaceNameTitle: _updatePlaceNameTitle,
    shouldDisplayElement: _shouldDisplayElement,
    searchInputActions: _searchInputActions,
    clearSearchResults: _clearSearchResults
  };

}();

document.addEventListener("DOMContentLoaded", function() {
  UI.init();
});