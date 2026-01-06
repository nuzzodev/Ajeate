# config/routes.rb
Rails.application.routes.draw do
  # API endpoints principales
  resources :clientes do
    get 'pedidos', on: :member
  end
  
  resources :pedidos do
    resources :combos, only: [:index]
  end
  
  resources :combos do
    collection do
      get 'por_sabor/:sabor_id', action: :por_sabor
    end
  end
  
  resources :bandejas do
    collection do
      get 'stock/bajo', to: 'bandejas#stock_bajo'
    end
    member do
    put :llenar_bandeja
    end
  end
  
  resources :sabores do
    member do
      get :materias_primas
      post :agregar_materia_prima
      put :preparar_sabor
    end
  end
  
  resources :tipo_combos do
    get 'combos', on: :member
    member do 
      get 'tipo_combos/:id/combos',to: 'tipo_combos#combos'
    end
  end
  
  resources :lotes do
    member do
      post :agregar_sabor
    end
  end
  
  resources :materia_primas do
    collection do
      get 'inventario/bajo',to: 'materia_primas#inventario_bajo'
    end
  end
  
  # Health check endpoint
  get 'health', to: 'health#check'
  
  # Root
  root 'health#check'
end