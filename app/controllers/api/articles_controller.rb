class Api::ArticlesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @articles = Article.includes(:user).all
    render json: @articles.as_json(include: { 
      user: { only: [:id, :name, :nickname, :photo] },
      comments: { only: [:id, :body, :created_at, :commenter] } }, 
      methods: [:photo_url, :user_photo_url])
  end

  def user_articles
    if params[:user_id].present?
      @articles = Article.includes(:user).where(user_id: params[:user_id])
      render json: @articles.as_json(include: { user: { only: [:id, :name, :nickname, :photo] }, comments: { only: [:id, :body, :created_at, :commenter] } }, methods: [:photo_url])
    else
      render json: { error: "User ID is required" }, status: :bad_request
    end
  end

  def show
    @article = Article.find(params[:id])
    render json: @article.as_json(include: { 
      user: { 
        only: [:id, :name, :nickname] 
      } 
    }).merge({
      photo: @article.user.photo.attached? ? url_for(@article.user.photo) : nil,
      comments: @article.comments.as_json(only: [:id, :body, :created_at, :commenter])
    })
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Статья не найдена' }, status: :not_found
  end

  def create
    puts "Received parameters: #{params.inspect}"

    if params[:user_id].blank?
      render json: { error: "User ID is required" }, status: :bad_request
      return
    end

    @user = User.find_by(id: params[:user_id])
    if @user.nil?
      render json: { error: "User not found" }, status: :not_found
      return
    end

    @article = @user.articles.new(article_params)
    puts "Article params before save: #{@article.attributes.inspect}"
    @article.photo.attach(params[:article][:photo]) if params[:article][:photo].present?

    @article.status = 'Default_status'
    puts "Article before save: #{@article.attributes.inspect}"
    if @article.save
      render json: @article.as_json(methods: [:photo_url]), status: :created
    else
      logger.error("Article creation failed: #{@article.errors.full_messages.join(', ')}")
      render json: { error: "НЕТ ЗАПИСЕЙ" }
    end
  end

  def update
    puts "Received parameters: #{params.inspect}"
    @article = Article.find(params[:id])
    if @article.update(article_params)
      render json: @article.as_json(methods: [:photo_url]), status: :ok
    else
      render json: { error: "НЕТ ЗАПИСЕЙ"}
    end
  end

  def destroy
    if params[:id].present?
      @article = Article.find(params[:id])
      PostSubscription.where(article_id: @article.id).destroy_all
      @article.destroy
      render json: { message: "Статья удалена" }, status: :ok
    else
      render json: { error: "Не указан идентификатор статьи" }, status: :bad_request
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Статья не найдена" }, status: :not_found
  end

  private

  def article_params
    params.require(:article).permit(:title, :body, :status, :photo)
  end
end