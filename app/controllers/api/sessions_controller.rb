class Api::SessionsController < Devise::SessionsController
  respond_to :json
  skip_before_action :verify_authenticity_token
  skip_before_action :require_no_authentication

  def create
    Rails.logger.info "Starting session creation process for user authentication"

    if current_user
      Rails.logger.warn "User already authenticated. Current user ID: #{current_user.id}. Requesting new session creation."
      render json: { error: 'Вы уже вошли в систему' }, status: :unprocessable_entity
      return
    end

    email = params.dig(:user, :email)&.strip
    password = params.dig(:user, :password)&.strip

    if email.blank? || password.blank?
      Rails.logger.error "Missing email or password in request. Params: #{params.inspect}. Authentication failed."
      render json: { error: 'Email и пароль обязательны' }, status: :unprocessable_entity
      return
    end

    Rails.logger.info "Attempting to authenticate user with email: #{email}"
    user = User.find_by(email: email)
    
    if user.nil?
      Rails.logger.warn "User not found for email: #{email}. Authentication attempt failed."
      render json: { error: 'Пользователь с таким email не найден' }, status: :unauthorized
      return
    end

    Rails.logger.debug "Validating password for user: #{user.id}"
    unless user.valid_password?(password)
      Rails.logger.warn "Invalid password for user: #{user.id}. Authentication attempt failed."
      render json: { error: 'Неверный пароль' }, status: :unauthorized
      return
    end

    begin
      Rails.logger.debug "Attempting to sign in user: #{user.inspect}"
      sign_in(user)
      Rails.logger.info "User authenticated successfully: #{user.id}. Setting secure cookies for session."
      cookies.signed[:user_id] = {
        value: user.id,
        expires: 24.hours.from_now,
        httponly: true,
        secure: Rails.env.production?,
        same_site: :lax
      }
      Rails.logger.info "Cookie set with user ID: #{cookies.signed[:user_id]}"

      render json: { 
        message: 'Успешный вход', 
        user: user.as_json(only: [:id, :email, :nickname]) 
      }, status: :ok
    rescue => e
      Rails.logger.error "Error during authentication: #{e.message}. Backtrace: #{e.backtrace.join("\n")}"
      render json: { error: 'Ошибка аутентификации', details: e.message }, status: :internal_server_error
    end
  rescue => e
    Rails.logger.error "Authentication error: #{e.message}\n#{e.backtrace.join("\n")}"
    render json: { error: 'Ошибка аутентификации', details: e.message }, status: :internal_server_error
  end

  def show
    Rails.logger.info "GET /api/sessions request received for current user session."

    if current_user
      render json: current_user.as_json(only: [:id, :email, :nickname, :photo]), status: :ok
      Rails.logger.info "Current user found: #{current_user.id}. Session details returned."
    else
      render json: { error: 'Пользователь не авторизован', details: 'Пожалуйста, войдите в систему.' }, status: :unauthorized
      Rails.logger.warn "No current user found - unauthorized"
    end
  rescue => e
    Rails.logger.error "Error in sessions#show: #{e.message}\n#{e.backtrace.join("\n")}"
    render json: { error: 'Ошибка сервера' }, status: :internal_server_error
    render json: { error: 'Ошибка сервера' }, status: :internal_server_error
  end

  def destroy
      Rails.logger.info "Starting logout process for user: #{current_user.id}."


    begin
      signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
      if signed_out
        cookies.delete(:user_id)
        Rails.logger.info "User successfully logged out. User ID: #{cookies.signed[:user_id]}. Session cleared."
        render json: { message: 'Успешный выход' }, status: :ok
      else
        Rails.logger.warn "Sign out failed for user ID: #{cookies.signed[:user_id]}"
        render json: { error: 'Ошибка при выходе' }, status: :unprocessable_entity
      end
    rescue => e
      Rails.logger.error "Error during logout: #{e.message}. Backtrace: #{e.backtrace.join("\n")}"
      render json: { error: 'Ошибка при выходе', details: e.message }, status: :internal_server_error
    end
  end

  def current
    Rails.logger.info "GET /api/sessions/current request received"
    if current_user
      render json: { user: current_user.as_json(only: [:id, :email, :nickname, :photo]) }, status: :ok
      Rails.logger.info "Current user found: #{current_user.id}"
    else
      render json: { error: 'Пользователь не авторизован', details: 'Пожалуйста, войдите в систему.' }, status: :unauthorized
      Rails.logger.warn "No current user found - unauthorized"
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password)
  end
end
