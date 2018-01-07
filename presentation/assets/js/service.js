var Service = function() {
  var _initialize = function(apiUrl, version){
    this.apiUrl = apiUrl;
    this.apiVersion = version;
    console.log(apiUrl);
    this.fayeClient = new Faye.Client(apiUrl + "faye");
    this.fayeClient.disable('websocket');
    this.fayeClient.disable('eventsource');
    this.subscribe = undefined;
    console.log(this.fayeClient);
  };

  /*
    Options:
      @city: string
      @route: string
      @success: function(data: json)
      @fetchFailure: function(error: string) [optional]
      @subscribeFailure: function(error: string) [optional]
  */
  var _listenToBusPositions = function(options){
    _.defaults(options, {fetchFailure: (error) => {} , subscribeFailure: (error) => {} });
    var _this = this;
    var url = this.apiUrl + "api/" + this.apiVersion + "/positions/" + options.city + "/" + options.route;
    
    _fetch(url).then(function(res) {
      var channel_id = res.message[0].id;
      console.log("Channel ID: " + channel_id);
        _this.subscribe = _this.fayeClient.subscribe('/' + channel_id, options.success);

      _this.subscribe.then(function() {
        console.log('Subscription is now active!: ');
      }, options.subscribeFailure);
    }, options.fetchFailure);
  };

  var _unsubscribeToBusPositions = function(){
    if(this.subscribe != undefined) {
      this.subscribe.cancel();
      this.subscribe = undefined;
      console.log("unsubscribed");
    }
  }

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

    var url = this.apiUrl + "api/" +  this.apiVersion + "/search/stop/coordinates/" + [options.start.join('/'),options.end.join('/')].join('/');
    return _fetch(url);
  };


  return {
    init: _initialize,
    search: _search,
    listenToBusPositions: _listenToBusPositions,
    unsubscribeToBusPositions: _unsubscribeToBusPositions
  };
}();



