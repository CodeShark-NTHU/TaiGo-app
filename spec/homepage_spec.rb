# frozen_string_literal: true

require_relative 'spec_helper'

describe 'Homepage' do
  before do
    unless @browser
      # TaiGo::ApiGateway.new.delete_all_repos #should we makesure to update the data first?
      @headless = Headless.new
      @browser = Watir::Browser.new
    end
  end

  after do
    @browser.close
    @headless.destroy
  end

  describe 'Empty Homepage' do
    include PageObject::PageFactory
    it '(HAPPY) should see only a map loaded' do
      # GIVEN: user is on the home page without any projects
      visit HomePage do |page|
        # THEN: user should see a map, the position you're right now, and search bar
        _(page.title_heading).must_equal 'TaiGo'
        _(page.url_input_element.visible?).must_equal true
        _(page.add_button_element.visible?).must_equal true
        _(page.repos_table_element.exists?).must_equal false
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
  end
end
