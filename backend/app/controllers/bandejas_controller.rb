# app/controllers/bandejas_controller.rb
class BandejasController < ApplicationController
  before_action :set_bandeja, only: [:show, :update, :destroy]

  # GET /bandejas
  def index
    @bandejas = Bandeja.includes(:sabor).all
    render json: @bandejas, include: [:sabor]
  end

  # GET /bandejas/:id
  def show
    render json: @bandeja, include: [:sabor, :combo_detalles]
  end

  # POST /bandejas
  def create
    @bandeja = Bandeja.new(bandeja_params)
    
    # Generar ID si no se proporciona
    if @bandeja.id_bandeja.blank?
      last_id = Bandeja.maximum(:id_bandeja) || 0
      @bandeja.id_bandeja = last_id + 1
    end

    if @bandeja.save
      render json: @bandeja, status: :created
    else
      render json: @bandeja.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /bandejas/:id
  def update
    if @bandeja.update(bandeja_params)
      render json: @bandeja
    else
      render json: @bandeja.errors, status: :unprocessable_entity
    end
  end

  # DELETE /bandejas/:id
  def destroy
    @bandeja.destroy
    head :no_content
  end

  # GET /bandejas/stock/bajo
  def stock_bajo
    @bandejas = Bandeja.where('cantidad_disponible < ?', 10).includes(:sabor)
    render json: @bandejas, include: [:sabor]
  end

  private

  def set_bandeja
    @bandeja = Bandeja.find(params[:id])
  end

  def bandeja_params
    params.require(:bandeja).permit(:id_bandeja, :fecha_produccion, :cantidad_disponible, :sabor_fk)
  end
end