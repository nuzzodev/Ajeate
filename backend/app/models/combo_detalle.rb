# app/models/combo_detalle.rb
class ComboDetalle < ApplicationRecord
  self.primary_key = 'id_combo_detalle'
  self.table_name = 'combo_detalle'
  
  belongs_to :combo, foreign_key: 'combo_fk', primary_key: 'id_combo'
  belongs_to :bandeja, foreign_key: 'bandeja_fk', primary_key: 'id_bandeja'
  
  validates :id_combo_detalle, presence: true, uniqueness: true
  validates :cantidad_por_sabor, numericality: { greater_than: 0 }
end

