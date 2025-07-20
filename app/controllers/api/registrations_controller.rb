class Api::RegistrationsController < Devise::RegistrationsController
  def create
    configure_devise_mapping
    user = User.new(
      email: params[:user][:email],
      name: params[:user][:name],
      nickname: params[:user][:nickname],
      password: params[:user][:password]
    )

    user.photo.attach(params[:user][:photo]) if params[:user][:photo].present?

    if user.save
      render json: { message: 'Пользователь успешно зарегистрирован' }, status: :created
    else
      render json: { error: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  respond_to :json
  skip_before_action :verify_authenticity_token

  def change_password
    configure_devise_mapping

    user = current_user
    if user.blank? 
      Rails.logger.error "User not found."
      render json: { error: 'Пользователь не авторизован' }, status: :unauthorized
      return
    end

    if !user.valid_password?(params[:registration][:currentPassword]) || params[:registration][:currentPassword].blank? 
      Rails.logger.error "Current password provided: [FILTERED]"
      Rails.logger.error "Invalid current password provided. Current user ID: #{user.id}, Params: #{params[:registration]}"
      render json: { error: 'Неверный текущий пароль' }, status: :unprocessable_entity
      return
    end

    if params[:registration][:newPassword].blank? || params[:registration][:newPassword].length < 6 
      Rails.logger.error "New password validation failed. New password must be at least 6 characters long. Provided length: #{params[:registration][:newPassword].length}"
      render json: { error: 'Новый пароль не может быть пустым и должен содержать не менее 6 символов' }, status: :unprocessable_entity
      return
    end

    if user.update(password: params[:registration][:newPassword], password_confirmation: params[:registration][:newPassword])
      logger.info("Password updated successfully for user #{user.id}")
      render json: { message: 'Пароль успешно изменен' }, status: :ok
    else
      render json: { error: 'Ошибка при изменении пароля', details: user.errors.full_messages }, status: :unprocessable_entity
      logger.error("Password update failed for user #{user.id}: #{user.errors.full_messages.join(', ')}")
    end
  end

  private

  def configure_devise_mapping
    request.env["devise.mapping"] = Devise.mappings[:user]
  end
end
