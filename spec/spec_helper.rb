# frozen_string_literal: true

ENV['RACK_ENV'] = 'test'

require 'minitest/autorun'
require 'minitest/rg'
require 'watir'
require 'headless'
# Note: Headless doesn't work on MacOS
#       Run XQuartz before trying Headless on MacOS

require './init.rb' # for config and infrastructure

require 'page-object'
require_relative 'pages/init' # uses TaiGo::App.config

HOST = 'http://localhost:4000'

#Selenium::WebDriver::Chrome.driver_path = "/usr/local/Cellar/chromedriver/2.34/bin/chromedriver"
#Selenium::WebDriver::Chrome.driver_path = "spec/chromedriver"

# Helper methods
def homepage
  HOST
end