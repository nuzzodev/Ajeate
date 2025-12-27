# app/controllers/sabores_controller.rb
class SaboresController < ApplicationController
  before_action :set_sabor, only: [:show, :update, :destroy]

  # GET /sabores
  def index
    @sabores = Sabor.all
    render json: @sabores, include:[] 
  end

  # GET /sabores/:id
  def show
    render json: @sabor, include: [:bandejas, :sabor_materias, :sabor_lotes]
  end

  # POST /sabores
  def create
    @sabor = Sabor.new(sabor_params)
    
    # Generar ID si no se proporciona
    if @sabor.id_sabor.blank?
      last_id = Sabor.maximum(:id_sabor) || 0
      @sabor.id_sabor = last_id + 1
    end

    if @sabor.save
      render json: @sabor, status: :created
    else
      render json: @sabor.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /sabores/:id
  def update
    if @sabor.update(sabor_params)
      render json: @sabor
    else
      render json: @sabor.errors, status: :unprocessable_entity
    end
  end

  # DELETE /sabores/:id
  def destroy
    @sabor.destroy
    head :no_content
  end

  # GET /sabores/:id/materias_primas
  def materias_primas
    @sabor = Sabor.find(params[:id])
    @materias_primas = @sabor.sabor_materias.includes(:materia_prima).map(&:materia_prima)
    render json: @materias_primas
  end

  # POST /sabores/:id/agregar_materia_prima
  def agregar_materia_prima
    @sabor = Sabor.find(params[:id])
    materia_prima_id = params[:materia_prima_id]
    
    # Crear relación sabor_materia
    sabor_materia = @sabor.sabor_materias.new(materia_prima_fk: materia_prima_id)
    
    if sabor_materia.save
      render json: { message: 'Materia prima agregada al sabor' }, status: :created
    else
      render json: sabor_materia.errors, status: :unprocessable_entity
    end
  end

  private

  def set_sabor
    @sabor = Sabor.find(params[:id])
  end

  def sabor_params
    params.require(:sabor).permit(:id_sabor, :nombre)
  end
end