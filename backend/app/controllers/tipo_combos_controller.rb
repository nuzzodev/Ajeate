# app/controllers/tipo_combos_controller.rb
class TipoCombosController < ApplicationController
  before_action :set_tipo_combo, only: [:show, :update, :destroy]

  # GET /tipo_combos
  def index
    @tipo_combos = TipoCombo.kept
    render json: @tipo_combos
  end

  # GET /tipo_combos/:id
  def show
    render json: @tipo_combo
  end

  # POST /tipo_combos
  def create
    @tipo_combo = TipoCombo.new(tipo_combo_params)
    
    # Generar ID si no se proporciona
    if @tipo_combo.id_tipocombo.blank?
      last_id = TipoCombo.maximum(:id_tipocombo) || 0
      @tipo_combo.id_tipocombo = last_id + 1
    end

    if @tipo_combo.save
      render json: @tipo_combo, status: :created
    else
      render json: @tipo_combo.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /tipo_combos/:id
  def update
    if @tipo_combo.update(tipo_combo_params)
      render json: @tipo_combo
    else
      render json: @tipo_combo.errors, status: :unprocessable_entity
    end
  end

  # DELETE /tipo_combos/:id
  def destroy
    if @tipo_combo.discard
      render json: { message: "Registro desactivado con éxito (borrado lógico)" }, status: :ok
    else
      render json: { errors: @cliente.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /tipo_combos/:id/combos
  def combos
    @tipo_combo = TipoCombo.find(params[:id])
    @combos = @tipo_combo.combos.includes(:pedido)
    render json: @combos, include: [:pedido]
  end

  private

  def set_tipo_combo
    @tipo_combo = TipoCombo.find(params[:id])
  end

  def tipo_combo_params
    params.require(:tipo_combo).permit(:id_tipocombo, :nombre)
  end
end