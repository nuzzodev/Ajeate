class SaborLote < ApplicationRecord
  self.primary_key = 'id_sabor_lote'
  self.table_name = 'sabor_lote'
  
  belongs_to :lote, foreign_key: 'lote_fk', primary_key: 'id_lote',inverse_of: :sabor_lotes
  belongs_to :sabor, foreign_key: 'sabor_fk', primary_key: 'id_sabor'
  
  before_validation :generate_id, on: :create
  validates :id_sabor_lote, presence: true, uniqueness: true

  private

  def generate_id
    if id_sabor_lote.blank?
      max_db = SaborLote.maximum(:id_sabor_lote) || 0
      
      otros_en_memoria = lote.sabor_lotes.select { |sl| sl.id_sabor_lote.present? && sl != self }
      max_memoria = otros_en_memoria.map(&:id_sabor_lote).max || 0
      
      self.id_sabor_lote = [max_db, max_memoria].max + 1
    end
  end
end