Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: 'users/sessions', registrations: 'users/registrations' } do
    match '/users/sessions', to: 'users/sessions#options', via: :options

    end

  devise_scope :user do
    delete 'delete_account/:id', to: 'users/registrations#delete_account', as: 'delete_account_user'
    get 'users/sign_out', to: 'users/sessions#destroy'
  end

  namespace :api do
    resources :photos do
      resources :comments, only: [:index, :create, :destroy]
    end
    resources :users, only: [:index, :show, :update] do
      member do
        post 'update_photo', to: 'users#update_photo'
      end
      get 'following_status', to: 'users#following_status', as: 'following_status' # New route to check follow status
      get 'following', to: 'users#following' # New route to fetch following users
      member do
        post :follow
        post :unfollow
        get :followers
        get :relationships
      end
      collection do
        get 'search', to: 'users#search' # Adding the search route here
      end
    end

    devise_for :users, controllers: {
      sessions: 'api/sessions',
      registrations: 'api/registrations'
    }
    
    devise_scope :user do
      get 'sessions/current', to: 'sessions#current'
      post 'sessions' => 'sessions#create'
      get 'sessions' => 'sessions#show'
      delete 'sessions' => 'sessions#destroy'
      post 'users' => 'registrations#create'
      post 'change-password', to: 'registrations#change_password'
      post 'registrations', to: 'registrations#create'
    end
    
    resources :post_subscriptions
    resources :subscriptions
    resources :articles do
      collection do
        get 'user_articles', to: 'articles#user_articles'
      end
      resources :comments
    end
    resources :sessions, only: [:create, :destroy]
    resources :registrations, only: [:create, :destroy]
  end
  
  resources :subscriptions, only: [:create, :destroy]
  resources :post_subscriptions, only: [:create, :destroy]
  root "articles#index"
end
