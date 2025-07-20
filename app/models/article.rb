class Article < ApplicationRecord
  # include Visible

  has_many :comments, dependent: :destroy
  belongs_to :user

  validates :title, presence: true
  validates :body, presence: true

  has_one_attached :photo

  has_many :post_subscriptions, dependent: :destroy
  has_many :subscribers, through: :post_subscriptions, source: :user
  def photo_url
    if photo.attached?
      url = Rails.application.routes.url_helpers.rails_blob_url(photo, only_path: true)
      puts "Photo URL: #{url}" # Debugging line to check the URL
      return url
    else
      puts "No photo attached." # Debugging line to indicate no photo is attached
      return nil
    end
  end
  def user_photo_url
    user.photo_url if user.present?
  end
  def self.ransackable_attributes(auth_object = nil)
    %w[title body]
  end
end
