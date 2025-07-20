class Api::CommentsController < ApplicationController
  skip_before_action :verify_authenticity_token

    
def index
        @article = Article.find(params[:article_id]) 
        @comments = @article.comments
        render json: @comments
    end

    def show
        @article = Article.find(params[:article_id])
        @comment = @article.comments.find(params[:id])
        render json: @comment
      end

    def create
        @article = Article.find(params[:article_id]) 
        puts "Received parameters: #{params.inspect}"
        puts "Comment Params: #{comment_params.inspect}"
        if current_user.nil?
            render json: { error: 'User must be logged in to comment' }, status: :unauthorized
            return
        end
        @comment = @article.comments.new(comment_params.merge(commenter: current_user.nickname))
        if @comment.save
            render json: @comment, status: :created
        else
            puts "Error creating comment: #{@comment.errors.full_messages}"
            render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
        end

    end
    
    private
    def comment_params
        params.require(:comment).permit(:commenter, :body)
    end
end
