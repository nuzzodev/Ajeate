# app/controllers/combos_controller.rb
class CombosController < ApplicationController
  before_action :set_combo, only: [:show, :update, :destroy]

  # GET /combos

  def index
    @combos = Combo.kept
    
    @combos = @combos.includes(:tipo_combo, :combo_detalles)
    
    render json: @combos, 
          include: [:tipo_combo, :combo_detalles],
          methods: [:sabores_info]
  end

  # GET /combos/:id
  def show
    render json: @combo, 
          include: [:tipo_combo, :combo_detalles],
          methods: [:sabores_info]
  end

  # POST /combos
  def create
    @combo = Combo.new(combo_params)
    
    # Generar ID si no se proporciona
    if @combo.id_combo.blank?
      last_id = Combo.maximum(:id_combo) || 0
      @combo.id_combo = last_id + 1
    end

    ActiveRecord::Base.transaction do
      if @combo.save
        @combo.combo_detalles.each do |detalle|
          bandeja = Bandeja.lock.find(detalle.bandeja_fk) # .lock ayuda a prevenir condiciones de carrera
          
          if bandeja.cantidad_disponible < detalle.cantidad_por_sabor
            raise ActiveRecord::Rollback, "Stock insuficiente en la bandeja #{bandeja.id_bandeja}"
          end

          # Calculamos el nuevo stock
          nuevo_stock = bandeja.cantidad_disponible - detalle.cantidad_por_sabor
          
          # Actualizamos la bandeja
          bandeja.update!(cantidad_disponible: nuevo_stock)

          # Lógica de descarte: Si el stock es 0, aplicamos borrado lógico
          if bandeja.cantidad_disponible == 0
            bandeja.discard # Esto marca la bandeja como descartada (discarded_at)
          end
        end

        render json: @combo, status: :created
      else
        render json: @combo.errors, status: :unprocessable_entity
      end
    rescue ActiveRecord::Rollback => e
      render json: { error: e.message }, status: :unprocessable_entity
    rescue StandardError => e
      render json: { error: "Error inesperado: #{e.message}" }, status: :internal_server_error
    end
  end

  # PATCH/PUT /combos/:id
  def update
    if @combo.update(combo_params)
      render json: @combo
    else
      render json: @combo.errors, status: :unprocessable_entity
    end
  end

  # DELETE /combos/:id
  def destroy
    if @combo.discard
      render json: { message: "Registro desactivado con éxito (borrado lógico)" }, status: :ok
    else
      render json: { errors: @cliente.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # GET /combos/por_sabor/:sabor_id
  def por_sabor
    sabor_id = params[:sabor_id]
    @combos = Combo.por_sabor_id(sabor_id).includes(:tipo_combo, :combo_detalles)
    
    render json: {
      sabor_id: sabor_id,
      combos: @combos,
      total: @combos.count
    }
  end
  
  

  private

  def set_combo
    @combo = Combo.find(params[:id])
  end

  def combo_params
    params.require(:combo).permit(:id_combo, :cantidad_empanadas, :tipo_combo_fk, :pedido_fk,combo_detalles_attributes: [ :cantidad_por_sabor, :bandeja_fk]
  )
  end
  
end