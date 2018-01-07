var Config = function() {
  var _setApiUrl = function(domain) {
    this.apiDomain = domain;
  };
  return {
    setApiUrl: _setApiUrl
  };
}();
