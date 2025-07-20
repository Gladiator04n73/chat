class UsersController < ApplicationController
  # before_action :authenticate_user!, except: [:show, :index]

  def show
    @user = User.find(params[:id])
  end

  def index
    @users = User.all
  end

  def follow
    @user = User.find(params[:id])
    current_user.follow(@user)
    redirect_to @user
  end

  def unfollow
    @user = User.find(params[:id])
    current_user.unfollow(@user)
    redirect_to @user
  end

  protected 

  def user_params
    params.require(:user).permit(:name, :email, :photo, :nickname)
  end
end