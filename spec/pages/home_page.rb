# frozen_string_literal: true

class HomePage
  include PageObject

  page_url TaiGo::App.config.APP_URL

  div(:map, id: 'map')
  div(:loading_screen, id: 'loading_screen')
  form(:search_input, id: 'search-input')
  a(:cancel_btn, id: 'cancel-btn')
  div(:trip_info_container, id: 'trip-info-container')
  h4(:place_title, id: 'place-title')

  i(:trip_duration, id: 'trip-duration')
  i(:trip_distance, id: 'trip-distance')
  
end
