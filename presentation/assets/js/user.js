var User = function() {
  var _initialize = function() {
  
  }; 

  /*
    @success: callback(locationData) 
    @fail: callback(error)
  */
  var _getUserLocation = function(success, fail){
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(success, fail);
    } else {
      error = {code: {error: {NOT_SUPPORTED: ""}}}; 
      fail(error);
    }
  };

  var _getErrorMessage = function(error) {
    var msg = "";
    switch(error.code) {
        case error.NOT_SUPPORTED: 
          msg = "Device does not support Geolocation";
          break;
        case error.PERMISSION_DENIED:
          msg = "User denied the request for Geolocation."
          break;
        case error.POSITION_UNAVAILABLE:
          msg = "Location information is unavailable."
          break;
        case error.TIMEOUT:
          msg = "The request to get user location timed out."
          break;
        case error.UNKNOWN_ERROR:
          msg = "An unknown error occurred."
          break;
    }

    return msg;
  }


  return {
    init: _initialize,
    getUserLocation: _getUserLocation,
    getErrorMessage: _getErrorMessage
  };
}();

document.addEventListener("DOMContentLoaded", function() {
  User.init();
});