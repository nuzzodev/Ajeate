# app/models/cliente.rb
class Cliente < ApplicationRecord
  self.table_name = 'cliente' 
  self.primary_key = 'id_cliente'
  
  has_many :pedidos, foreign_key: 'cliente_fk', primary_key: 'id_cliente'
  
  validates :id_cliente, presence: true, uniqueness: true
  validates :nombre, :apellido, presence: true
end