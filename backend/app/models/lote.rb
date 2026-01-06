class Lote < ApplicationRecord
  self.table_name = 'lote'
  self.primary_key = 'id_lote'
  
  has_many :sabor_lotes, foreign_key: 'lote_fk', primary_key: 'id_lote',inverse_of: :lote, dependent: :destroy
  
  validates :id_lote, presence: true, uniqueness: true
  validates :cantidad_lote, numericality: { greater_than: 0 }
  accepts_nested_attributes_for :sabor_lotes, allow_destroy: true
end