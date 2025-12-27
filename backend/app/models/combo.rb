# app/models/combo.rb
class Combo < ApplicationRecord
  self.table_name = 'combo'
  self.primary_key = 'id_combo'
  
  belongs_to :pedido, foreign_key: 'pedido_fk', primary_key: 'id_pedido'
  belongs_to :tipo_combo, foreign_key: 'tipo_combo_fk', primary_key: 'id_tipocombo'
  has_many :combo_detalles, foreign_key: 'combo_fk', primary_key: 'id_combo'
  has_many :bandejas, through: :combo_detalles
  has_many :sabores, through: :bandejas
  
  validates :id_combo, presence: true, uniqueness: true
  validates :cantidad_empanadas, numericality: { greater_than: 0 }
  
  # Métodos de búsqueda por sabor - CORREGIDOS
  def self.por_sabor_id(sabor_id)
    joins(combo_detalles: { bandeja: :sabor })
      .where('sabor.id_sabor = ?', sabor_id)  # Usa 'sabor' singular
      .distinct
  end
  
  def self.por_nombre_sabor(nombre)
    joins(combo_detalles: { bandeja: :sabor })
      .where('sabor.nombre ILIKE ?', "%#{nombre}%")  # Usa 'sabor' singular
      .distinct
  end
  
  def self.por_sabores(sabor_ids)
    joins(combo_detalles: { bandeja: :sabor })
      .where('sabor.id_sabor IN (?)', sabor_ids)  # Usa 'sabor' singular
      .group('combo.id_combo')
      .having('COUNT(DISTINCT sabor.id_sabor) = ?', sabor_ids.length)  # 'sabor' singular
      .distinct
  end
  
  # Método para obtener detalles por sabor
  def detalles_por_sabor
    combo_detalles.joins(:bandeja)
                  .joins('INNER JOIN sabor ON bandeja.sabor_fk = sabor.id_sabor')
                  .group('sabor.id_sabor', 'sabor.nombre')
                  .select(
                    'sabor.id_sabor',
                    'sabor.nombre as sabor_nombre',
                    'sabor.imagen_url as imagen_url',
                    'SUM(combo_detalle.cantidad_por_sabor) as total'
                  )
  end
  
  # Método para serializar información de sabores
  def sabores_info
    detalles = detalles_por_sabor
    
    detalles.map do |detalle|
      {
        id_sabor: detalle.id_sabor,
        nombre: detalle.sabor_nombre,
        # Llama al método del modelo Sabor o usa helper
        imagen: Sabor.imagen_por_nombre(detalle.sabor_nombre),
        cantidad: detalle.total.to_i
      }
    end
  end
end