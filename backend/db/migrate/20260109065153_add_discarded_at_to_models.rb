class AddDiscardedAtToModels < ActiveRecord::Migration[7.0]
  def change
    target_tables = [
      "bandeja", "cliente", "combo", "combo_detalle", "lote", 
      "materia_prima", "pedido", "sabor", "sabor_lote", 
      "sabor_materia", "tipo_combo", "users"
    ]

    existing_tables = ActiveRecord::Base.connection.tables

    target_tables.each do |table_name|
      if existing_tables.include?(table_name)
        unless column_exists?(table_name, :discarded_at)
          add_column table_name, :discarded_at, :datetime
          add_index  table_name, :discarded_at
        end
      else
        puts "Aviso: La tabla '#{table_name}' no se encontró. Verifica si se llama así exactamente."
      end
    end
  end
end