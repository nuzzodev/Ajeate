class MateriaPrima < ApplicationRecord
  self.primary_key = 'id_materia_prima'
  self.table_name = 'materia_prima'
  
  has_many :sabor_materias, foreign_key: 'materia_prima_fk', primary_key: 'id_materia_prima',inverse_of: :materia_prima

  accepts_nested_attributes_for :sabor_materias, allow_destroy: true
  
  validates :id_materia_prima, presence: true, uniqueness: true
  validates :nombre, :marca, presence: true
  validates :cantidad, numericality: { greater_than_or_equal_to: 0 }
end