# frozen_string_literal: true

require 'roda'
require 'slim'

module TaiGo
  # Web App
  class App < Roda
   
    plugin :render, engine: 'slim', views: 'presentation/views'
    plugin :assets, css: 'style.css', path: 'presentation/assets'
    plugin :assets, js: ['map.js', 'ui.js'], path: 'presentation/assets'
    plugin :assets, image: 'default-marker-icon.png', path: 'presentation/assets'
   
    opts[:root] = 'presentation/assets'
    plugin :public, root: 'static'
    
    route do |routing|
      routing.assets
      routing.public
      app = App

      # GET / request
      routing.root do
        #routes_json = ApiGateway.new.all_routes
        #all_routes = TaiGo::BusRoutesRepresenter.new(OpenStruct.new).from_json routes_json
        #puts all_routes
        #view 'home', locals: { routes: all_routes.routes }
        view 'home'
      end
    end
  end
end
