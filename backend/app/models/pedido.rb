class Pedido < ApplicationRecord
  self.table_name = 'pedido'
  self.primary_key = 'id_pedido'
  
  belongs_to :cliente, foreign_key: 'cliente_fk', primary_key: 'id_cliente'
  has_many :combos, foreign_key: 'pedido_fk', primary_key: 'id_pedido'
  
  validates :id_pedido, presence: true, uniqueness: true
end