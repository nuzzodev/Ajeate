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

  # POST /lotes/:id/agregar_sabor
  def agregar_sabor
    @lote = Lote.find(params[:id])
    sabor_id = params[:sabor_id]
    
    # Crear relación sabor_lote
    sabor_lote = @lote.sabor_lotes.new(sabor_fk: sabor_id)
    
    if sabor_lote.save
      render json: { message: 'Sabor agregado al lote' }, status: :created
    else
      render json: sabor_lote.errors, status: :unprocessable_entity
    end
  end

  private

  def set_lote
    @lote = Lote.find(params[:id])
  end

  def lote_params
    params.require(:lote).permit(:id_lote, :cantidad_lote)
  end
end