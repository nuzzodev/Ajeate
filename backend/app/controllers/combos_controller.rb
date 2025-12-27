# app/controllers/combos_controller.rb
class CombosController < ApplicationController
  before_action :set_combo, only: [:show, :update, :destroy]

  # GET /combos
  # GET /combos?por_sabor=1
  # GET /combos?por_sabor=Pollo
  def index
    @combos = Combo.all
    
    # Filtrar por pedido si viene el parámetro
    if params[:pedido_id]
      @combos = @combos.where(pedido_fk: params[:pedido_id])
    end
    
    # Filtrar por sabor si viene el parámetro por_sabor
    if params[:por_sabor].present?
      @combos = filtrar_por_sabor(@combos, params[:por_sabor])
    end
    
    # Incluir relaciones
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

    if @combo.save
      render json: @combo, status: :created
    else
      render json: @combo.errors, status: :unprocessable_entity
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
    @combos = Combo.por_sabor_id(sabor_id)
                   .includes(:tipo_combo, :combo_detalles)
    
    render json: {
      sabor_id: sabor_id,
      combos: @combos,
      total: @combos.count
    }
  end
  
  # GET /combos/con_sabor/:nombre
  def por_nombre_sabor
    nombre = params[:nombre]
    @combos = Combo.por_nombre_sabor(nombre)
                   .includes(:tipo_combo, :combo_detalles)
    
    render json: {
      sabor_buscado: nombre,
      combos: @combos,
      total: @combos.count
    }
  end
  
  # GET /combos/buscar
  def buscar
    @combos = Combo.all
    
    # Solo filtro por sabor por ahora
    if params[:sabor].present?
      sabor_param = params[:sabor]
      if sabor_param.to_s.match?(/^\d+$/)
        @combos = @combos.por_sabor_id(sabor_param.to_i)
      else
        @combos = @combos.por_nombre_sabor(sabor_param)
      end
    end
    
    # Filtros adicionales simples
    @combos = @combos.where(tipo_combo_fk: params[:tipo_combo]) if params[:tipo_combo].present?
    @combos = @combos.where(pedido_fk: params[:pedido]) if params[:pedido].present?
    
    render json: {
      combos: @combos,
      total: @combos.count
    }
  end

  private

  def set_combo
    @combo = Combo.find(params[:id])
  end

  def combo_params
    params.require(:combo).permit(:id_combo, :cantidad_empanadas, :tipo_combo_fk, :pedido_fk)
  end
  
  def filtrar_por_sabor(combos, sabor_param)
    # Si es un array de IDs [1, 2, 3]
    if sabor_param.is_a?(Array)
      combos.por_sabores(sabor_param.map(&:to_i))
    # Si es string con IDs separados por comas "1,2,3"
    elsif sabor_param.to_s.match?(/^\d+(,\d+)*$/)
      ids = sabor_param.split(',').map(&:to_i)
      combos.por_sabores(ids)
    # Si es texto (nombre)
    else
      combos.por_nombre_sabor(sabor_param)
    end
  end
end