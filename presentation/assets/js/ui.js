var UI = function() {
  
  var _initalize = function() {
   // _shouldDisplayElement('#trip-info-container', false);
    this.searchForm = document.getElementById('search-container')
  
    var _this = this;

    //this.faye_client = faye_client;

   

    this.searchForm.onsubmit = function(e){
      e.preventDefault();
      _this.clearSearchResults();
      var address = _this.searchForm.search_input.value;
      Map.geocodeAddress(address, function(result){
        renderGeocodeAddress(result);
      });

      
    };
   
    //starts listening for user location
    User.startUserLocationWatch(function(data){
      //handle success
      var userCoords = [data.coords.longitude, data.coords.latitude];
      
      //updates user marker
      Map.setUserMarker(userCoords, _createUserMarkerElm(), generatePopupTemplate({title: "User", desc: "You're here now."}));
      
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
    
    if(Map.hasLines()){
      var searchInput = document.getElementById('search-input');
      searchInput.value = "";
      _shouldDisplayElement('#trip-info-container', false);
      _shouldDisplayElement('#search-cancel', false);


      //remove dest marker - TODO - maybe add this as a function of Map.js?
      Map.destMarker.remove();
      Map.destMarker = undefined;

      Map.removeAllBusStops();

      //remove all markers. - TODO
      Map.removeAllLines();


      Service.unsubscribeToBusPositions();
    }

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
  var generatePopupTemplate = function(options){
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

  var createBusStopMarkerElem = function() {
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

  var drawWalkingPath = function(color, data){
    _.each(data, function(v,i,l){
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
  };

  var openMessageModal = function(title,message,type){
    // instanciate new modal
    var modal = new tingle.modal({
      footer: true,
      stickyFooter: false,
      closeMethods: ['overlay', 'button', 'escape'],
      closeLabel: "Close",
      cssClass: [type + '-modal'],
      onOpen: function() {
          console.log('modal open');
      },
      onClose: function() {
          console.log('modal closed');
      },
      beforeClose: function() {
          // here's goes some logic
          // e.g. save content before closing the modal
          return true; // close the modal
        return false; // nothing happens
      }
    });

    var template = "<h2>" + title +"</h2> <p>" + message + "</p>";

    // set content
    modal.setContent(template);

    // add a button
    modal.addFooterBtn('Okay', 'tingle-btn tingle-btn--primary tingle-btn--pull-right', function() {
      // here goes some logic
      modal.close();
    });

    // open modal
    modal.open();

    // close modal
   // modal.close();
          
  };


  var renderBusStops = function(stops){
    _.each(stops, function(stop_details, k){
      var stop_info = stop_details.stop;
      var sub_route_info = stop_details.sub_route;
  
      var coordinates = [stop_info.coordinates.longitude, stop_info.coordinates.latitude];
      var sub_route_name = sub_route_info.name.english;
      var stop_name = stop_info.name.english;

      if(_.isUndefined(stop_name) || stop_name == ""){
        stop_name = stop_info.name.chinese;
      }

      var popup = generatePopupTemplate({title: stop_name});

      Map.addBusStopMarker(coordinates,createBusStopMarkerElem(), popup);

    });
  };


  var renderBuses = function(city, route){
    var _this = this;
    Service.listenToBusPositions({
      city: city,
      route: route,
      success: function(data){
        
      },
      failure: function(err){
        console.log("Error: " + err);
      }
    });
  };

  var renderGeocodeAddress = function(result){
    if(result.length > 0) {
      console.log(result);
      var data = result[0];
      var location = data.geometry.location;

      //Get place information about destination
      Map.getPlaceDetails(data.place_id, function(place,status){
        if(status){
          var popup = generatePopupTemplate({title: place.name, desc: data.formatted_address});
          var destCoords = [location.lat(),location.lng()];
          //add marker
          Map.setDestinationMarker( [location.lng(),location.lat()], popup, _createBusMarkerElem());

          var userCoords = User.getUserLocation();
           
          

          if(!_.isUndefined(userCoords)){
            
            //get top 3 nearest stops to user which are in the same subroute as destination

            Service.search({
              start: [userCoords.lat,userCoords.lng],
              end: destCoords
            }).then(function(data){
              data = data.possibleways;
              
              if(data.length > 0){ //This will give an error if data is not an array - TODO
                
                // Draw things in the map
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
                  drawWalkingPath(color, walking_steps);

                  //Draws routes for the buses
                  _.each(bus_steps, function(v,i,l){
                    var points = _.map(v.bus_path, function(v, i){
                      return [v.longitude, v.latitude];
                    });
                    
                    Map.drawLine({
                      id: Factory.generateId(),
                      geoJson: Map.generateLineString(points),
                      lineColor: color
                    });

                    //add the stops of routes
                    var stops_of_sub_routes = v.sub_routes; 
                    
                    _.each(stops_of_sub_routes, function(sub_route,j){
                      var stops = sub_route.stops_of_sub_route;

                      renderBusStops(stops)

                    });
                    

                    var route_name = v.sub_routes[0].sub_route_name_ch;
                    var city_name = v.sub_routes[0].stops_of_sub_route[0].stop.city_name;

                    

                    //show real-time buses
                    renderBuses(city_name, route_name);

                  });

                  if(i == (data.length - 1)){
                    Map.fitCurrentBounds();
                    //update place title
                    _updatePlaceNameTitle(place.name);
                    updateTripDetails(bus_steps[data.length - 1]);
                    //display trip info
                    _shouldDisplayElement('#trip-info-container', true);
                  }



                });

               
              } else {
                //Handle no routes found error - TODO

              }
            }, function(error){
              //Handle error with UI - TODO
              console.log(error);
            });
            
           
          } else {
            //show some UI error message. 
          }

         

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

  var updateTripDetails = function(data){
    var trip_duration = document.getElementById('trip-duration');
    trip_duration.innerHTML = data.bus_duration;
    console.log("Distance: "+ data.bus_distance);
    var trip_distance = document.getElementById('trip-distance');
    trip_distance.innerHTML = data.bus_distance;
  };
  
  return {
    init: _initalize,
    generatePopupTemplate: generatePopupTemplate,
    updatePlaceNameTitle: _updatePlaceNameTitle,
    shouldDisplayElement: _shouldDisplayElement,
    searchInputActions: _searchInputActions,
    clearSearchResults: _clearSearchResults
  };

}();

document.addEventListener("DOMContentLoaded", function() {
  UI.init();
});