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
        _(page.loading_screen_element.visible?).must_equal true
      end

    end
    
  

    it '(HAPPY) should see only a map loaded' do
      # GIVEN: the map loaded already
      visit HomePage do |page|

        Watir::Wait.until { _(page.loading_screen_element.visible?).must_equal false }
         
        
        # WAIT: Until the loading screen disappears 
        
        # THEN: user should see a map, the position you're right now, and search bar
        #_(page.map_element.visible?).must_equal true
        _(page.map_element.visible?).must_equal true
        _(page.search_input_element.visible?).must_equal true
      end
    end
  end

  # describe 'Input new search' do
  #   # include PageObject::PageFactory

  #   it '(HAPPY) should add project with valid URL' do
  #     # GIVEN: user is on the home page
  #     visit HomePage do |page|
  #       # WHEN: user enters a valid URL for a new repo
  #       page.add_new_repo 'https://github.com/soumyaray/YPBT-app'

  #       # THEN: user should see their new repo listed in a table
  #       _(page.success_message).must_include 'added'
  #       _(page.repos_table_element.visible?).must_equal true
  #       _(page.listed_repo(page.first_repo)).must_equal(
  #         owner: 'soumyaray',
  #         name: 'YPBT-app',
  #         gh_url: 'https://github.com/soumyaray/YPBT-app',
  #         num_contributors: 3
  #       )
  #     end
  #   end
  #end
end
