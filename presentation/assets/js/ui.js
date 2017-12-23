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
      Map.setUserMarker(userCoords, _createUserMarkerElm(), _generatePopupTemplate({title: "User", desc: "You're here now."}));
      
    }, function(error) {
      //handle failure here.
      //add modal or message at the bottom UI here - TODO
      alert("ERROR: " + User.getErrorMessage(error));
    });

    /*$("#hamburger-menu a").toggle(function(e) {
     // e.preventDefault();
      var sidebar = $("#side-menu-container");

      sidebar.css({"left":"2000px"}).animate({"left":"0px"}, "slow"); 

      return false;
    }); */
   
  }

  var _clearSearchResults = function() {
    var searchInput = document.getElementById('search-input');
    searchInput.value = "";
    _shouldDisplayElement('#trip-info-container', false);


    //remove dest marker - TODO - maybe add this as a function of Map.js?
    Map.destMarker.remove();
    Map.destMarker = undefined;

    //remove all markers. - TODO
    Map.removeAllLines();


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

  var _createBusStopMarkerElem = function() {
    var el = document.createElement('div');
    el.innerHTML = '<div class="pin-bus-stop"><i class="material-icons">store_mall_directory</i></div>';
    return el;
  }

  var _createBusMarkerElem = function() {
    var el = document.createElement('div');
    el.innerHTML = '<div class="pin-bus"><i class="material-icons">directions_bus</i></div>';
    return el;
  }

  var _createUserMarkerElm = function() {
    var el = document.createElement('div');
    el.innerHTML = '<div  class="pulse"></div>';
    return el;
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
          var destCoords = [location.lat(),location.lng()];
          //add marker
          Map.setDestinationMarker( [location.lng(),location.lat()], popup, _createBusMarkerElem());

          var userCoords = User.getUserLocation();
          console.log("user: " + JSON.stringify(userCoords));
          console.log("dest: " + JSON.stringify(destCoords));

          if(!_.isUndefined(userCoords)){
            
            //get top 3 nearest stops to user which are in the same subroute as destination

            Service.search({
              start: [userCoords.lat,userCoords.lng],
              end: destCoords
            }).then(function(data){
              data = data.possibleways;

              if(data.length > 0){
                _.each(_.chain(data).reverse().value(), function(v,i,l){

                  var walking_steps = v.walking_steps;
                  var bus_steps = v.bus_steps;

                  var color = ''
                    if(i == (data.length - 1)){
                      color = '#2196F3';
                    }else {
                      color = Factory.hex2rgb('#616161', 0.5).css;
                     
                    }

                  //draw the walking path(s)
                  _.each(walking_steps, function(v,i,l){

                    var points = _.map(v.walking_path, function(v, i){
                      return [v.longitude, v.latitude];
                    });

                    Map.drawLine({
                      id: Factory.generateId(),
                      geoJson: Map.generateLineString(points),
                      lineColor: color,
                      type: 'dashed'
                    });
                  });

                  _.each(bus_steps, function(v,i,l){
                    var points = _.map(v.bus_path, function(v, i){
                      return [v.longitude, v.latitude];
                    });
                    
                    Map.drawLine({
                      id: Factory.generateId(),
                      geoJson: Map.generateLineString(points),
                      lineColor: color
                    });

                  });

                });
              } else {
                //Handle no routes found error - TODO
              }
            }, function(error){
              //Handle error with UI - TODO
              console.log(error);
            });

           /* var geojson = Map.generateLineString(bbox);

            Map.drawLine({
              id: "line", //test id - TODO - Remove later
              geoJson: geojson
            }); */
            
            
            
           
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
    clearSearchResults: _clearSearchResults,
    createBusStopMarkerElem: _createBusStopMarkerElem
  };

}();

document.addEventListener("DOMContentLoaded", function() {
  UI.init();
});