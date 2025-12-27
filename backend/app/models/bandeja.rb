class Bandeja < ApplicationRecord
  self.table_name='bandeja'
  self.primary_key = 'id_bandeja'
  
  belongs_to :sabor, foreign_key: 'sabor_fk', primary_key: 'id_sabor'
  has_many :combo_detalles, foreign_key: 'bandeja_fk', primary_key: 'id_bandeja'
  
  validates :id_bandeja, presence: true, uniqueness: true
  validates :cantidad_disponible, numericality: { greater_than_or_equal_to: 0 }
end