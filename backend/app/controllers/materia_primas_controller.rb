# app/controllers/materia_primas_controller.rb
class MateriaPrimasController < ApplicationController
  before_action :set_materia_prima, only: [:show, :update, :destroy]

  # GET /materia_primas
  def index
    @materia_primas = MateriaPrima.all
    render json: @materia_primas
  end

  # GET /materia_primas/:id
  def show
    render json: @materia_prima, include: [:sabor_materias]
  end

  # POST /materia_primas
  def create
    @materia_prima = MateriaPrima.new(materia_prima_params)
    
    # Generar ID si no se proporciona
    if @materia_prima.id_materia_prima.blank?
      last_id = MateriaPrima.maximum(:id_materia_prima) || 0
      @materia_prima.id_materia_prima = last_id + 1
    end

    if @materia_prima.save
      render json: @materia_prima, status: :created
    else
      render json: @materia_prima.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /materia_primas/:id
  def update
    if @materia_prima.update(materia_prima_params)
      render json: @materia_prima
    else
      render json: @materia_prima.errors, status: :unprocessable_entity
    end
  end

  # DELETE /materia_primas/:id
  def destroy
    @materia_prima.destroy
    head :no_content
  end

  # GET /materia_primas/inventario/bajo
  def inventario_bajo
    @materia_primas = MateriaPrima.where('cantidad < ?', 50) # Ajusta el límite según necesites
    render json: @materia_primas
  end

  private

  def set_materia_prima
    @materia_prima = MateriaPrima.find(params[:id])
  end

  def materia_prima_params
    params.require(:materia_prima).permit(:id_materia_prima, :nombre, :cantidad, :marca)
  end
end