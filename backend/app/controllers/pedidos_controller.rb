# app/controllers/pedidos_controller.rb
class PedidosController < ApplicationController
  before_action :set_pedido, only: [:show, :update, :destroy]

  # GET /pedidos
  def index
    @pedidos = Pedido.includes(:cliente, :combos).all
    render json: @pedidos, include: [:cliente, :combos]
  end

  # GET /pedidos/:id
  def show
    render json: @pedido, include: [:cliente, combos: {include: [:tipo_combo, :combo_detalles]}]
  end

  # POST /pedidos
  def create
    @pedido = Pedido.new(pedido_params)
    
    # Generar ID si no se proporciona
    if @pedido.id_pedido.blank?
      last_id = Pedido.maximum(:id_pedido) || 0
      @pedido.id_pedido = last_id + 1
    end

    if @pedido.save
      render json: @pedido, status: :created
    else
      render json: @pedido.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /pedidos/:id
  def update
    if @pedido.update(pedido_params)
      render json: @pedido
    else
      render json: @pedido.errors, status: :unprocessable_entity
    end
  end

  # DELETE /pedidos/:id
  def destroy
    @pedido.destroy
    head :no_content
  end

  private

  def set_pedido
    @pedido = Pedido.find(params[:id])
  end

  def pedido_params
    params.require(:pedido).permit(
      :hora_entrega, :cliente_fk,
      combos_attributes: [
        :cantidad_empanadas, :tipo_combo_fk, :precio,
        combo_detalles_attributes: [:bandeja_fk, :cantidad_por_sabor]
      ]
    )
  end
end