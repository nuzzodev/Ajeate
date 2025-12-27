class AddPrecioToCombos < ActiveRecord::Migration[7.0]
  def change
    add_column :combo, :precio, :decimal, precision: 10, scale: 2, default: 1.20
    # precision: total de dígitos, scale: decimales
  end
end