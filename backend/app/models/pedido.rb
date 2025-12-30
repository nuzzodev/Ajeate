class Pedido < ApplicationRecord
  self.table_name = 'pedido'
  self.primary_key = 'id_pedido'
  
  belongs_to :cliente, foreign_key: 'cliente_fk', primary_key: 'id_cliente'
  
  has_many :combos, foreign_key: 'pedido_fk', primary_key: 'id_pedido', inverse_of: :pedido
  
  accepts_nested_attributes_for :combos
  
  validates :combos, presence: true
end