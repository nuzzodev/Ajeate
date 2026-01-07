class SaboresController < ApplicationController
  before_action :set_sabor, only: [:show, :update, :destroy]

  # GET /sabores
  def index
    @sabores = Sabor.all
    render json: @sabores
  end

  # GET /sabores/:id
  def show
    render json: @sabor, include: [:bandejas, :sabor_materias, :sabor_lotes]
  end


# POST /sabores
# app/controllers/sabores_controller.rb
def create
  datos = sabor_params
  if datos[:id_sabor].blank?
    last_id = Sabor.maximum(:id_sabor) || 0
    datos[:id_sabor] = last_id + 1
  end

  @sabor = Sabor.new(datos)

  begin
    if @sabor.save
      render json: @sabor.as_json(include: :sabor_materias), status: :created
    else
      render json: @sabor.errors, status: :unprocessable_entity
    end
  rescue ActiveRecord::InvalidForeignKey => e
    # Capturamos el error de PostgreSQL y lo devolvemos como 422
    render json: { 
      error: "Error de integridad: Una de las materias primas especificadas no existe.",
      detalle: e.message 
    }, status: :unprocessable_entity
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
    sabor_materia = @sabor.sabor_materias.new(materia_prima_fk: params[:materia_prima_id])

    if sabor_materia.save
      render json: { message: 'Materia prima agregada al sabor' }, status: :created
    else
      render json: sabor_materia.errors, status: :unprocessable_entity
    end
  end


# PUT /sabores/:id/preparar_sabor
  def preparar_sabor
    @sabor = Sabor.find(params[:id])
    
    cantidad_final_obtenida = params[:cantidad_final].to_f
    
    ingredientes_utilizados = params[:ingredientes] 

    if cantidad_final_obtenida <= 0
      return render json: { error: "Debes especificar cuántos kg de sabor preparaste." }, status: :bad_request
    end

    if ingredientes_utilizados.blank?
      return render json: { error: "Debes especificar los ingredientes utilizados." }, status: :bad_request
    end

    begin
      ActiveRecord::Base.transaction do
        ingredientes_utilizados.each do |ing_params|
          relacion = @sabor.sabor_materias.find_by!(materia_prima_fk: ing_params[:materia_prima_id])
          materia_prima = relacion.materia_prima
          cantidad_a_descontar = ing_params[:cantidad].to_f

          if materia_prima.cantidad < cantidad_a_descontar
            raise "Stock insuficiente de #{materia_prima.nombre}. Disponible: #{materia_prima.cantidad}, Requerido: #{cantidad_a_descontar}"
          end
          materia_prima.update!(cantidad: materia_prima.cantidad - cantidad_a_descontar)
        end

        nuevo_stock_sabor = (@sabor.cantidad || 0) + cantidad_final_obtenida
        @sabor.update!(cantidad: nuevo_stock_sabor)
      end

      render json: {
        message: "Producción registrada exitosamente",
        sabor: @sabor.nombre,
        cantidad_añadida: cantidad_final_obtenida,
        stock_actual_sabor: @sabor.cantidad
      }, status: :ok

    rescue => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  private

  def set_sabor
    @sabor = Sabor.find(params[:id])
  end

  def sabor_params
  params.require(:sabor).permit(
    :id_sabor, 
    :nombre, 
    :imagen_url, 
    :cantidad,
    sabor_materias_attributes: [:materia_prima_fk] # Asegúrate de que este nombre coincida con tu JSON
  )
  end
end