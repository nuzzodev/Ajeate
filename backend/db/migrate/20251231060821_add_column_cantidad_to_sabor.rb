class AddColumnCantidadToSabor < ActiveRecord::Migration[8.1]
  def change
    add_column :sabor, :cantidad, :decimal, precision:10,scale:2, default:10.00
  end
end
