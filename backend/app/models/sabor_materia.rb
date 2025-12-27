# app/models/sabor_materia.rb
class SaborMateria < ApplicationRecord
  self.primary_key = 'id_sabor_materia'
  self.table_name = 'sabor_materia'
  
  belongs_to :sabor, foreign_key: 'sabor_fk', primary_key: 'id_sabor'
  belongs_to :materia_prima, foreign_key: 'materia_prima_fk', primary_key: 'id_materia_prima'
  
  validates :id_sabor_materia, presence: true, uniqueness: true
end