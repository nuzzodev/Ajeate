class AddImagenUrlToSabor < ActiveRecord::Migration[7.0]
  def change
    add_column :sabor, :imagen_url, :string, default: '/images/sabores/default.jpg'
  end
  
end