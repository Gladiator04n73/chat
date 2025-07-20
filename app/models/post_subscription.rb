class PostSubscription < ApplicationRecord
  belongs_to :user
  belongs_to :post, class_name: 'Article'
end
