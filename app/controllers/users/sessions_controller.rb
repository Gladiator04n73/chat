# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  # before_action :configure_sign_in_params, only: [:create]
  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  # def create
  #   super
  #   if params[:user][:email] =~ /deleted_user\d+@admin.ru/
  #     sign_out(current_user)
  #   end
  # end

  def check_email
    if current_user.email =~ /deleted_user\d+@admin.ru/
      sign_out(current_user)
      respond_to do |format|
        format.json { render json: { status: "Ваш аккаунт удалён." } }
        format.html
      end
    end
  end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
end
