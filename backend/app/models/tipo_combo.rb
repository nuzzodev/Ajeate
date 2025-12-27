# app/models/tipo_combo.rb
class TipoCombo < ApplicationRecord
  self.primary_key = 'id_tipocombo'
  self.table_name = 'tipo_combo'
  
  has_many :combos, foreign_key: 'tipo_combo_fk', primary_key: 'id_tipocombo'
  
  validates :id_tipocombo, presence: true, uniqueness: true
end