# app/controllers/combos_controller.rb
class CombosController < ApplicationController
  before_action :set_combo, only: [:show, :update, :destroy]

  # GET /combos

  def index
    @combos = Combo.all
    
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
# app/controllers/combos_controller.rb
  def create
    @combo = Combo.new(combo_params)
    
    # Generar ID si no se proporciona
    if @combo.id_combo.blank?
      last_id = Combo.maximum(:id_combo) || 0
      @combo.id_combo = last_id + 1
    end

    # Iniciamos la transacción para asegurar consistencia
    ActiveRecord::Base.transaction do
      if @combo.save
        # Iteramos sobre los detalles del combo recién creado para descontar de las bandejas
        @combo.combo_detalles.each do |detalle|
          bandeja = Bandeja.find(detalle.bandeja_fk)
          
          # Verificamos si hay suficiente stock (Opcional pero recomendado)
          if bandeja.cantidad_disponible < detalle.cantidad_por_sabor
            raise ActiveRecord::Rollback, "Stock insuficiente en la bandeja #{bandeja.id_bandeja}"
          end

          # Descontamos la cantidad
          bandeja.update!(cantidad_disponible: bandeja.cantidad_disponible - detalle.cantidad_por_sabor)
        end

        render json: @combo, status: :created
      else
        render json: @combo.errors, status: :unprocessable_entity
      end
    rescue ActiveRecord::Rollback => e
      # Si hubo un rollback manual (por stock), enviamos el error
      render json: { error: e.message }, status: :unprocessable_entity
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
    @combo.destroy
    head :no_content
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