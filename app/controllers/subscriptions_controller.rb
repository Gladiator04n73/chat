class SubscriptionsController < ApplicationController
  before_action :authenticate_user!

  def create
    author = User.find_by(id: params[:author_id])
    if author.nil?
      redirect_to authors_path, alert: 'Author not found.'
    else
      current_user.authors << author unless current_user.authors.include?(author)
      redirect_to authors_path, notice: 'You have successfully subscribed.'
    end

  def destroy
    subscription = current_user.authors.find_by(id: params[:id])
    subscription.destroy if subscription
    redirect_to authors_path, notice: 'Subscription has been cancelled.'
  end
end
