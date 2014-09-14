Rails.application.routes.draw do

  resources :statistic, :report, :user

  resources :rates do
    member do
      post :saveCells
    end
  end

  resources :hotel do
    resources :directions, :reservation

    collection do
      get 'checkHotel'
    end
  end

  root 'statistic#index'


end
