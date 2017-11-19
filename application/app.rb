# frozen_string_literal: true

require 'roda'
require 'slim'

module TaiGo
  # Web App
  class App < Roda
    plugin :render, engine: 'slim', views: 'presentation/views'
    plugin :assets, css: 'style.css', path: 'presentation/assets'

    route do |routing|
      routing.assets
      app = App

      # GET / request
      routing.root do
        routes_json = ApiGateway.new.all_routes
        all_routes = TaiGo::BusRoutesRepresenter.new(OpenStruct.new).from_json routes_json
        puts all_routes
        view 'home', locals: { routes: all_routes.routes }
      end
    end
  end
end
