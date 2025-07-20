class PostSubscriptionsController < ApplicationController
  before_action :authenticate_user!

  def create
    post = Article.find(params[:post_id])
    current_user.subscribed_posts << post unless current_user.subscribed_posts.include?(post)
    redirect_to post, notice: 'You have successfully subscribed to this post.'
  end

  def destroy
    subscription = current_user.post_subscriptions.find_by(post_id: params[:id])
    subscription.destroy if subscription
    redirect_to articles_path, notice: 'Subscription has been cancelled.'
  end
end