# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_01_09_065153) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "bandeja", primary_key: "id_bandeja", id: :serial, force: :cascade do |t|
    t.integer "cantidad_disponible"
    t.datetime "discarded_at"
    t.date "fecha_produccion"
    t.integer "sabor_fk"
    t.index ["discarded_at"], name: "index_bandeja_on_discarded_at"
  end

  create_table "cliente", primary_key: "id_cliente", id: { type: :string, limit: 20 }, force: :cascade do |t|
    t.string "apellido", limit: 20
    t.string "direccion", limit: 30
    t.datetime "discarded_at"
    t.string "nombre", limit: 20
    t.string "telefono", limit: 25
    t.index ["discarded_at"], name: "index_cliente_on_discarded_at"
  end

  create_table "combo", primary_key: "id_combo", id: :serial, force: :cascade do |t|
    t.integer "cantidad_empanadas"
    t.datetime "discarded_at"
    t.integer "pedido_fk"
    t.decimal "precio", precision: 10, scale: 2, default: "1.2"
    t.integer "tipo_combo_fk"
    t.index ["discarded_at"], name: "index_combo_on_discarded_at"
  end

  create_table "combo_detalle", primary_key: "id_combo_detalle", id: :serial, force: :cascade do |t|
    t.integer "bandeja_fk"
    t.integer "cantidad_por_sabor"
    t.integer "combo_fk"
    t.datetime "discarded_at"
    t.index ["discarded_at"], name: "index_combo_detalle_on_discarded_at"
  end

  create_table "existing_schemas", force: :cascade do |t|
  end

  create_table "lote", primary_key: "id_lote", id: :serial, force: :cascade do |t|
    t.integer "cantidad_lote"
    t.datetime "discarded_at"
    t.index ["discarded_at"], name: "index_lote_on_discarded_at"
  end

  create_table "materia_prima", primary_key: "id_materia_prima", id: :serial, force: :cascade do |t|
    t.float "cantidad"
    t.datetime "discarded_at"
    t.string "marca", limit: 20
    t.string "nombre", limit: 20
    t.index ["discarded_at"], name: "index_materia_prima_on_discarded_at"
  end

  create_table "pedido", primary_key: "id_pedido", id: :serial, force: :cascade do |t|
    t.string "cliente_fk", limit: 20
    t.datetime "discarded_at"
    t.time "hora_entrega"
    t.index ["discarded_at"], name: "index_pedido_on_discarded_at"
  end

  create_table "sabor", primary_key: "id_sabor", id: :serial, force: :cascade do |t|
    t.decimal "cantidad", precision: 10, scale: 2, default: "10.0"
    t.datetime "discarded_at"
    t.string "imagen_url", default: "/images/sabores/default.jpg"
    t.string "nombre", limit: 20
    t.index ["discarded_at"], name: "index_sabor_on_discarded_at"
  end

  create_table "sabor_lote", primary_key: "id_sabor_lote", id: :serial, force: :cascade do |t|
    t.datetime "discarded_at"
    t.integer "lote_fk"
    t.integer "sabor_fk"
    t.index ["discarded_at"], name: "index_sabor_lote_on_discarded_at"
  end

  create_table "sabor_materia", primary_key: "id_sabor_materia", id: :serial, force: :cascade do |t|
    t.datetime "discarded_at"
    t.integer "materia_prima_fk"
    t.integer "sabor_fk"
    t.index ["discarded_at"], name: "index_sabor_materia_on_discarded_at"
  end

  create_table "tipo_combo", primary_key: "id_tipocombo", id: :serial, force: :cascade do |t|
    t.datetime "discarded_at"
    t.string "nombre", limit: 20
    t.index ["discarded_at"], name: "index_tipo_combo_on_discarded_at"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "discarded_at"
    t.integer "level"
    t.string "name"
    t.string "password_digest"
    t.datetime "updated_at", null: false
    t.index ["discarded_at"], name: "index_users_on_discarded_at"
  end

  add_foreign_key "bandeja", "sabor", column: "sabor_fk", primary_key: "id_sabor", name: "fk_bandeja_sabor"
  add_foreign_key "combo", "pedido", column: "pedido_fk", primary_key: "id_pedido", name: "pedido_fk"
  add_foreign_key "combo", "tipo_combo", column: "tipo_combo_fk", primary_key: "id_tipocombo", name: "fk_combo_tipo"
  add_foreign_key "combo_detalle", "bandeja", column: "bandeja_fk", primary_key: "id_bandeja", name: "fk_detalle_bandeja"
  add_foreign_key "combo_detalle", "combo", column: "combo_fk", primary_key: "id_combo", name: "fk_detalle_combo"
  add_foreign_key "pedido", "cliente", column: "cliente_fk", primary_key: "id_cliente", name: "fk_pedido_cliente"
  add_foreign_key "sabor_lote", "lote", column: "lote_fk", primary_key: "id_lote", name: "fk_saborlote_lote"
  add_foreign_key "sabor_lote", "sabor", column: "sabor_fk", primary_key: "id_sabor", name: "fk_saborlote_sabor"
  add_foreign_key "sabor_materia", "materia_prima", column: "materia_prima_fk", primary_key: "id_materia_prima", name: "fk_sabormateria_materia"
  add_foreign_key "sabor_materia", "sabor", column: "sabor_fk", primary_key: "id_sabor", name: "fk_sabormateria_sabor"
end
