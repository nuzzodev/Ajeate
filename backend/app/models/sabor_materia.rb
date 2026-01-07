# app/models/sabor_materia.rb
class SaborMateria < ApplicationRecord
  self.table_name = 'sabor_materia'
  self.primary_key = 'id_sabor_materia'
  
  # Agregamos optional: true a ambos
  belongs_to :materia_prima, 
             foreign_key: 'materia_prima_fk', 
             primary_key: 'id_materia_prima',
             optional: true 

  belongs_to :sabor, 
             foreign_key: 'sabor_fk', 
             primary_key: 'id_sabor', 
             inverse_of: :sabor_materias,
             optional: true
end