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

    User.getUserLocation(function(data){
      //handle success
      
      console.log(data); //remove

      Map.addMarker({
        coord: [data.coords.longitude, data.coords.latitude],
        color: "#2196F3",
        popupTemplate: _generatePopupTemplate({title: "User", desc: "You're here now."})
      });

      Map.map.flyTo({
        center: [data.coords.longitude, data.coords.latitude],
        zoom: 14
      });
      
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

          //add marker
          Map.addMarker({
            coord: [location.lng(), location.lat()],
            popupTemplate: popup
          });

          //update place title
          _updatePlaceNameTitle(place.name);

          //update other things

          //display trip infor
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