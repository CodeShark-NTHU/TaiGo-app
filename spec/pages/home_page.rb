# frozen_string_literal: true

class HomePage
  include PageObject

  page_url TaiGo::App.config.APP_URL

  div(:warning_message, id: 'flash_bar_danger')
  div(:success_message, id: 'flash_bar_success')

  h1(:title_heading, id: 'main_header')
  text_field(:url_input, id: 'url_input')
  button(:add_button, id: 'repo_form_submit')
  
end
