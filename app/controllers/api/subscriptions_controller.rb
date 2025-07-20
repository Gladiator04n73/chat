class Api::SubscriptionsController < ApplicationController

    def destroy 
        @subscription = current_user.subscriptions.find_by(author_id: params[:id])
        if @subscription
            @subscription.destroy
            render json: { message: "Subscription has been cancelled." }
        else
            render json: { error: "Subscription not found." }, status: :not_found
        end
    end

    def create
        @author = User.find_by(id: params[:author_id])
        if @author
            current_user.subscriptions.create(author: @author)
            render json: { message: "You have successfully subscribed." }, status: :created
        else
            render json: { error: "Author not found." }, status: :not_found
        end
    end
end