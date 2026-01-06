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
      # 1. Buscamos el ID más alto guardado en la DB
      max_db = SaborLote.maximum(:id_sabor_lote) || 0
      
      # 2. Buscamos los SaborLotes que están "en cola" para guardarse pero no están en la DB
      # Esto evita que dos sabores nuevos tomen el mismo ID
      otros_en_memoria = lote.sabor_lotes.select { |sl| sl.id_sabor_lote.present? && sl != self }
      max_memoria = otros_en_memoria.map(&:id_sabor_lote).max || 0
      
      # 3. Asignamos el máximo entre la DB y lo que ya calculamos en memoria, más 1
      self.id_sabor_lote = [max_db, max_memoria].max + 1
    end
  end
end