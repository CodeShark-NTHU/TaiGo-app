# frozen_string_literal: true

require_relative 'collaborator_representer'

# Represents essential Repo information for API output
module TaiGo
  class RepoRepresenter < Roar::Decorator
    include Roar::JSON

    property :origin_id
    property :owner, extend: CollaboratorRepresenter, class: OpenStruct
    property :name
    property :git_url
    collection :contributors, extend: CollaboratorRepresenter, class: OpenStruct
  end
end
