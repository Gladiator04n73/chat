class User < ApplicationRecord
  # Allow Ransack to search specific attributes
  def self.ransackable_attributes(auth_object = nil)
    ["name", "nickname", "email", "description", "gender"]
  end

  # Follow relationships
  has_many :follows, foreign_key: :follower_id, class_name: 'Follow', dependent: :destroy
  has_many :following, through: :follows, source: :followed
  has_many :inverse_follows, foreign_key: :followed_id, class_name: 'Follow', dependent: :destroy
  has_many :followers, through: :inverse_follows, source: :follower

  def follow(other_user)
    following << other_user unless following.include?(other_user)
  end
  def photo_url
    photo.attached? ? Rails.application.routes.url_helpers.rails_blob_url(photo, only_path: true) : nil
  end
  def unfollow(other_user)
    following.delete(other_user)
  end

  # Removed default values for validations
  validates :name, presence: false
  validates :description, presence: false
  validates :gender, presence: false
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  after_initialize :set_default_photo, if: :new_record?

  def set_default_photo
    self.photo.attach(io: File.open(Rails.root.join('public', 'default.jpg')), 
    filename: 'default.jpg') unless photo.attached?
  end
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_one_attached :photo
  has_many :articles

  has_many :subscriptions, foreign_key: :subscriber_id, dependent: :destroy
  has_many :authors, through: :subscriptions

  has_many :subscribers_subscriptions, class_name: 'Subscription', foreign_key: :author_id, dependent: :destroy
  has_many :subscribers, through: :subscribers_subscriptions, source: :subscrib

  has_many :post_subscriptions, dependent: :destroy

  has_many :subscribed_posts, through: :post_subscriptions, source: :post, class_name: 'Article'
end
