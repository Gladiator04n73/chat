class ArticlesController < ApplicationController

  def index
    @articles = Article.all
    @q = Article.ransack(params[:q])
    @articles = @q.result(distinct: true)
  end

  def show
    @article = Article.find(params[:id])
  end

  def new
    @article = Article.new
  end

  def create
    @article = current_user.articles.build(article_params)
    puts "Attempting to save article with photo: #{@article.photo.attached?}" # Debugging line
    if @article.save
      redirect_to @article, notice: 'Article was successfully created.'
    else
      render :new
    end
  end

  def edit
    @article = Article.find(params[:id])
  end

  def update
    @article = Article.find(params[:id])

    puts "Attempting to update article with photo: #{@article.photo.attached?}" # Debugging line
    if @article.update(article_params)
      redirect_to @article
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @article = Article.find(params[:id])
    @article.destroy

    redirect_to root_path, status: :see_other
  end

  private
    def article_params
      params.require(:article).permit(:title, :body, :status, :photo)
    end
end