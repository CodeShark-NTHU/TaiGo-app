# frozen_string_literal: true

require 'http'

module TaiGo
  class ApiGateway
    def initialize(config = TaiGo::App.config)
      @config = config
    end

    def all_routes
      call_api(:get, 'all_routes')
    end

    # def sub_routes
    #   call_api(:get, 'route_id')
    # end

    # def stop_of_routes
    #   call_api(:get, 'sub_route_id')
    # end

    # def create_routes(city_name)
    #   call_api(:post, ['routes', city_name])
    # end
    
    def call_api(method, resources)
      url_route = [@config.api_url, resources].flatten.join'/'
      result = HTTP.send(method, url_route)
      raise(result.to_s) if result.code >= 300
      result.to_s
    end
  end
end
