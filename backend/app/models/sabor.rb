# app/models/sabor.rb
class Sabor < ApplicationRecord
  self.table_name = 'sabor'  # IMPORTANTE: tabla singular
  self.primary_key = 'id_sabor'
  
  has_many :bandejas, foreign_key: 'sabor_fk', primary_key: 'id_sabor'
  has_many :combo_detalles, through: :bandejas
  has_many :combos, through: :combo_detalles

  def imagen_local
    # Nombre del archivo basado en el nombre del sabor
    nombre_archivo = "#{nombre.downcase.gsub(' ', '_').gsub('ñ', 'n')}.jpg"
    
    # Verificar si existe el archivo
    ruta_completa = Rails.public_path.join('images', 'sabores', nombre_archivo)
    
    if File.exist?(ruta_completa)
      "/images/sabores/#{nombre_archivo}"
    else
      # Imagen por defecto
      "/images/sabores/default.jpg"
    end
  end

  # Método para el controller de Combos
  def self.imagen_por_nombre(nombre_sabor)
    nombre_archivo = "#{nombre_sabor.downcase.gsub(' ', '_').gsub('ñ', 'n')}.jpg"
    ruta = Rails.public_path.join('images', 'sabores', nombre_archivo)
    
    if File.exist?(ruta)
      "/images/sabores/#{nombre_archivo}"
    else
      "/images/sabores/default.jpg"
    end
  end
end