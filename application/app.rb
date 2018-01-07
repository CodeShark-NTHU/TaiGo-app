# frozen_string_literal: true

require 'roda'
require 'slim'

module TaiGo
  # Web App
  class App < Roda
   
    plugin :render, engine: 'slim', views: 'presentation/views'
    plugin :assets, css: ['tingle.min.css','style.css'], path: 'presentation/assets'
    plugin :assets, js: ['tingle.min.js','config.js','factory.js','user.js','service.js','map.js', 'ui.js'], path: 'presentation/assets'
    plugin :assets, images:['default-marker-icon.png','loading.svg'], path: 'presentation/assets'
  
    opts[:root] = 'presentation/assets'
    plugin :public, root: 'static'
  
    route do |routing|
      routing.assets
      routing.public
      app = App

      api_domain = app.config.API_URL
      api_version = app.config.API_VERSION

      # GET / request
      routing.root do
        #routes_json = ApiGateway.new.all_routes
        #all_routes = TaiGo::BusRoutesRepresenter.new(OpenStruct.new).from_json routes_json
        #puts all_routes
        view 'home', locals: { api_domain: api_domain,  api_version: api_version }
        #view 'home'
      end
    end
  end
end
