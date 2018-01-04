var Config = function() {
  return {
    version: 'v0.1/',
    domain: 'http://localhost:9292',
    getBaseApiUrl: function(){
      return [this.domain,"api",this.version].join('/');
    }

  };
}();
