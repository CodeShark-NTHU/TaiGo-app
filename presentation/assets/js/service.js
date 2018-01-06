var Service = function() {
  var _initialize = function(){
    this.apiUrl = Config.getBaseApiUrl();
  };

  var _fetch = function(url) {
    return new Promise((resolve, reject) => {
      return fetch(url).then(response => {
        if (response.ok) {
          response.json().then(function(data){
            resolve(data);
          });
        } else {
          reject(new Error('error'))
        }
      }, error => {
        reject(new Error(error.message))
      })
    });
  };
  /*
    Options:
      @start: [lat,lng], - Required
      @end: [lat,lng] - Required
    Returns: Promise
  */
  var _search = function(options){
    //Handle error if missing parameter here - TODO

    var url = this.apiUrl + "search/stop/coordinates/" + [options.start.join('/'),options.end.join('/')].join('/');
    return _fetch(url);
  };


  return {
    init: _initialize,
    search: _search
  };
}();


document.addEventListener("DOMContentLoaded", function() {
  Service.init();
});