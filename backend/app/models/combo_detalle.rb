# app/models/combo_detalle.rb
class ComboDetalle < ApplicationRecord
  self.primary_key = 'id_combo_detalle'
  self.table_name = 'combo_detalle'
  
  belongs_to :combo, foreign_key: 'combo_fk', primary_key: 'id_combo',inverse_of: :combo_detalles,optional: true
  belongs_to :bandeja, foreign_key: 'bandeja_fk', primary_key: 'id_bandeja'
  
  validates :cantidad_por_sabor, numericality: { greater_than: 0 }
end

