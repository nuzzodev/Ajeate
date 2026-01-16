# app/controllers/bandejas_controller.rb
class BandejasController < ApplicationController
  before_action :set_bandeja, only: [:show, :update, :destroy]

  # GET /bandejas
  def index
    @bandejas = Bandeja.includes(:sabor).kept
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
    if @bandeja.discard
      render json: { message: "Registro desactivado con éxito (borrado lógico)" }, status: :ok
    else
      render json: { errors: @cliente.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /bandejas/stock/bajo
  def stock_bajo
    @bandejas = Bandeja.where('cantidad_disponible < ?', 50).includes(:sabor)
    render json: @bandejas, include: [:sabor]
  end

  # PUT /bandejas/:id/llenar_bandeja
  def llenar_bandeja
    @bandeja = Bandeja.find(params[:id])
    sabor = @bandeja.sabor 
    

    cantidad_sabor_usada = params[:cantidad_sabor_gastada].to_f
    
    unidades_producidas = params[:unidades_producidas].to_i

    if sabor.nil?
      return render json: { error: "Esta bandeja no tiene un sabor asociado." }, status: :unprocessable_entity
    end

    if cantidad_sabor_usada <= 0 || unidades_producidas <= 0
      return render json: { error: "Las cantidades deben ser mayores a cero." }, status: :bad_request
    end

    begin
      ActiveRecord::Base.transaction do
        if (sabor.cantidad || 0) < cantidad_sabor_usada
          raise "Stock insuficiente del sabor #{sabor.nombre}. Disponible: #{sabor.cantidad}"
        end

        sabor.update!(cantidad: sabor.cantidad - cantidad_sabor_usada)

        nuevo_stock_bandeja = (@bandeja.cantidad_disponible || 0) + unidades_producidas
        @bandeja.update!(cantidad_disponible: nuevo_stock_bandeja)
      end

      render json: {
        message: "Bandejas llenadas exitosamente",
        sabor_restante: sabor.cantidad,
        stock_bandeja_actual: @bandeja.cantidad_disponible
      }, status: :ok

    rescue => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  private

  def set_bandeja
    @bandeja = Bandeja.find(params[:id])
  end

  def bandeja_params
    params.require(:bandeja).permit(:id_bandeja, :fecha_produccion, :cantidad_disponible, :sabor_fk)
  end
end