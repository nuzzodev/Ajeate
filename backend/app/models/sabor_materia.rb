class SaborMateria < ApplicationRecord
  self.primary_key = 'id_sabor_materia'
  self.table_name = 'sabor_materia'
  
  # El inverse_of permite que el hijo "vea" al padre antes de que ambos tengan ID
  belongs_to :materia_prima, 
            foreign_key: 'materia_prima_fk', 
            primary_key: 'id_materia_prima',
            inverse_of: :sabor_materias
  
  belongs_to :sabor, foreign_key: 'sabor_fk', primary_key: 'id_sabor', optional: true

  # Quitamos validación de presencia de id_sabor_materia porque es SERIAL
end