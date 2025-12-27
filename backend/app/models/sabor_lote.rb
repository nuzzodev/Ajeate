class SaborLote < ApplicationRecord
  self.primary_key = 'id_sabor_lote'
  self.table_name = 'sabor_lote'
  
  belongs_to :lote, foreign_key: 'lote_fk', primary_key: 'id_lote'
  belongs_to :sabor, foreign_key: 'sabor_fk', primary_key: 'id_sabor'
  
  validates :id_sabor_lote, presence: true, uniqueness: true
end