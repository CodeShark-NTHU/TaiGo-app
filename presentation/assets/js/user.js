var User = function() {
  var _initialize = function() {
    this.userLocationID = undefined;
  }; 

  var _startUserLocationWatch = function(success, error){
    var options = {
      enableHighAccuracy: false
    };

    var _this = this;

    this.userLocationID = navigator.geolocation.watchPosition(function(data){
      _this.setUserLocation(data.coords.longitude, data.coords.latitude);
      console.log(localStorage.getItem('TaiGo.userLocation'));
      success(data);
    }, error, options);
  };

  var _stopUserLocationWatch = function(){
     navigator.geolocation.clearWatch(this.userLocationID);
  }

  var _updateUserLocationNow = function(success, error){
    var _this = this;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(data) {
        _this.setUserLocation(data.coords.longitude, data.coords.latitude)
        success(data);
      }, fail);
    } else {
      error = {code: {error: {NOT_SUPPORTED: ""}}}; 
      fail(error);
    }
  };

  var _setUserLocation = function(lng, lat){
    coords = {lng: lng, lat: lat};
    localStorage.setItem('TaiGo.userLocation', JSON.stringify(coords));
  };

  var _getUserLocation = function() {
    return JSON.parse(localStorage.getItem('TaiGo.userLocation'));
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
    startUserLocationWatch: _startUserLocationWatch,
    stopUserLocationWatch: _stopUserLocationWatch,
    updateUserLocationNow: _updateUserLocationNow,
    setUserLocation: _setUserLocation,
    getUserLocation: _getUserLocation,
    updateUserLocationNow: _updateUserLocationNow,
    getErrorMessage: _getErrorMessage
  };
}();

document.addEventListener("DOMContentLoaded", function() {
  User.init();
});