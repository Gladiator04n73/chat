class Api::PostSubscriptionsController < ApplicationController
    before_action :authenticate_user!

    def index
        @posts = current_user.subscribed_posts
        render json: @posts
    end 

    def show
        @post = Article.find_by(id: params[:id])
        if @post
            render json: @post
        else
            render json: { error: 'Статья не найдена' }, status: :not_found
        end
    end

    def create
        @post = Article.find_by(id: params[:post_id])
        if @post
            current_user.subscribed_posts << @post unless current_user.subscribed_posts.include?(@post)
            render json: current_user.subscribed_posts, status: :created
        else
            render json: { error: 'Статья не найдена' }, status: :not_found
        end
    end

    def destroy
        @post = Article.find_by(id: params[:post_id])
        if @post
            current_user.subscribed_posts.delete(@post)
            render json: { message: "Подписка удалена" }, status: :ok
        else
            render json: { error: 'Статья не найдена' }, status: :not_found
        end
    end
end