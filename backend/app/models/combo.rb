class Combo < ApplicationRecord
  self.table_name = 'combo'
  self.primary_key = 'id_combo'
  
  # Añade esta línea para autoincrement
  self.inheritance_column = nil
  
  #DE UNO A UNO
  belongs_to :pedido, foreign_key: 'pedido_fk', primary_key: 'id_pedido', inverse_of: :combos
  belongs_to :tipo_combo, foreign_key: 'tipo_combo_fk', primary_key: 'id_tipocombo'
  
  #DE UNO A MUCHOS
  has_many :combo_detalles, foreign_key: 'combo_fk', primary_key: 'id_combo', inverse_of: :combo
  has_many :bandejas, through: :combo_detalles
  has_many :sabores, through: :bandejas
  
  accepts_nested_attributes_for :combo_detalles
  
  validates :cantidad_empanadas, numericality: { greater_than: 0 }
  
  def self.por_sabor_id(sabor_id)
    joins(combo_detalles: { bandeja: :sabor })
      .where('sabor.id_sabor = ?', sabor_id)  
      .distinct
  end
  
  #Funcion necesaria para acceder a los Sabores anclados al combo
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
        imagen: Sabor.imagen_por_nombre(detalle.sabor_nombre),
        cantidad: detalle.total.to_i
      }
    end
  end
end