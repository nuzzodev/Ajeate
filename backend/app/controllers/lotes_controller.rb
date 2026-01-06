# app/controllers/lotes_controller.rb
class LotesController < ApplicationController
  before_action :set_lote, only: [:show, :update, :destroy]

  # GET /lotes
  def index
    @lotes = Lote.includes(:sabor_lotes).all
    render json: @lotes, include: [:sabor_lotes]
  end

  # GET /lotes/:id
  def show
    render json: @lote, include: [sabor_lotes: {include: [:sabor]}]
  end

  # POST /lotes
  def create
    @lote = Lote.new(lote_params)
    
    # Generar ID si no se proporciona
    if @lote.id_lote.blank?
      last_id = Lote.maximum(:id_lote) || 0
      @lote.id_lote = last_id + 1
    end

    if @lote.save
      render json: @lote, status: :created
    else
      render json: @lote.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /lotes/:id
  def update
    if @lote.update(lote_params)
      render json: @lote
    else
      render json: @lote.errors, status: :unprocessable_entity
    end
  end

  # DELETE /lotes/:id
  def destroy
    @lote.destroy
    head :no_content
  end

def agregar_sabor
  @lote = Lote.find(params[:id])
  
  # 1. Obtener el ID del sabor desde el JSON
  sabor_id = params[:sabor_id]
  
  # 2. Generar el nuevo ID para la tabla intermedia (Manual)
  last_id = SaborLote.maximum(:id_sabor_lote) || 0
  nuevo_id = last_id + 1
  
  # 3. Crear la instancia asignando los valores manualmente
  @sabor_lote = SaborLote.new(
    id_sabor_lote: nuevo_id,
    lote_fk: @lote.id_lote,
    sabor_fk: sabor_id
  )
  
  if @sabor_lote.save
    render json: { message: 'Sabor agregado al lote', data: @sabor_lote }, status: :created
  else
    render json: @sabor_lote.errors, status: :unprocessable_entity
  end
end

  private

  def set_lote
    @lote = Lote.find(params[:id])
  end

  def lote_params

  params.require(:lote).permit(
    :id_lote, 
    :cantidad_lote, 
    sabor_lotes_attributes: [:sabor_fk]
  )
end
end