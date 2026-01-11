class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class
  include Discard::Model 
  self.abstract_class = true
end
