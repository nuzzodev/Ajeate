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
      # Endpoints para filtrar combos por sabores
      get 'por_sabor/:sabor_id', action: :por_sabor
      get 'buscar', action: :buscar  # Para búsquedas avanzadas
      get 'con_sabor/:nombre', action: :por_nombre_sabor
    end
  end
  
  resources :bandejas do
    collection do
      get 'stock/bajo'
    end
  end
  
  resources :sabores
  
  resources :tipo_combos do
    get 'combos', on: :member
  end
  
  resources :lotes
  
  resources :materia_primas do
    collection do
      get 'inventario/bajo'
    end
  end
  
  # Health check endpoint
  get 'health', to: 'health#check'
  
  # Root
  root 'health#check'
end