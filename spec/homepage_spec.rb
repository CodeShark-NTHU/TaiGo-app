# frozen_string_literal: true

require_relative 'spec_helper'

describe 'Homepage' do
  before do
    unless @browser
      # TaiGo::ApiGateway.new.delete_all_repos #should we makesure to update the data first?
      @headless = Headless.new
      @browser = Watir::Browser.new

      Watir.relaxed_locate = true
    end
  end

  after do
    @browser.close
    @headless.destroy
   
  end

 

  describe 'Empty Homepage' do
    include PageObject::PageFactory

    it '(HAPPY) should  see a loading screen' do
      visit HomePage do |page|
        #page.page_body_element.click
        _(page.loading_screen_element.visible?).must_equal true
      end

    end
    
  

    it '(HAPPY) should see only a map loaded' do
      # GIVEN: the loading screen is visible
      visit HomePage do |page|
        # WAIT: Until the loading screen disappears 
        #page.page_body_element.click
        #Watir::Wait.until { page.loading_screen_element.visible? false }
        page.loading_screen_element.wait_while_present
        # THEN: user should see a map, the position it is right now, and search bar
        _(page.map_element.visible?).must_equal true
        _(page.search_input_element.visible?).must_equal true
        
      end
    end
  end

  describe 'Input new search' do
    include PageObject::PageFactory

    it '(HAPPY) should search a valid address/location' do
       # GIVEN: user is on the home page
      visit HomePage do |page|
         # WAIT: Until the loading screen disappears 
         #page.page_body_element.click
         #Watir::Wait.until { page.loading_screen_element.visible? false }
        page.loading_screen_element.wait_while_present
        # WHEN: user clicks on search input to focus, enter location
        page.search_input_element.click
        page.search_input_element.set("Hsinchu Station")
        page.search_input_element.send_keys :enter

        # THEN: user should see the trip information
        page.trip_info_container_element.wait_until_present
        #_(page.trip_info_container_element.visible?).must_equal true

        _(page.place_title_element).must_include "Hsinchu Station"

       # _(page.success_message).must_include 'added'
       # _(page.repos_table_element.visible?).must_equal true
       # _(page.listed_repo(page.first_repo)).must_equal(
  #         owner: 'soumyaray',
  #         name: 'YPBT-app',
  #         gh_url: 'https://github.com/soumyaray/YPBT-app',
  #         num_contributors: 3
  #       )
     end
   end
  end
end
