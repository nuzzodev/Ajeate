class Lote < ApplicationRecord
  self.table_name = 'lote'
  self.primary_key = 'id_lote'
  
  has_many :sabor_lotes, foreign_key: 'lote_fk', primary_key: 'id_lote'
  
  validates :id_lote, presence: true, uniqueness: true
  validates :cantidad_lote, numericality: { greater_than: 0 }
end