# app/controllers/pedidos_controller.rb
class PedidosController < ApplicationController
  before_action :set_pedido, only: [:show,:update, :destroy]

  # GET /pedidos
  def index
    @pedidos = Pedido.includes(:cliente).kept
    render json: @pedidos, include: [:cliente]
  end

  #GET /pedidos/:id
  def show
    render json: @pedido, include: {
      cliente: {},
      combos: {
        include: {
          combo_detalles: {
            include: {
              bandeja: {
                include: :sabor 
              }
            }
          }
        }
      }
    }
  end

  # POST /pedidos

  def create
    @pedido = Pedido.new(pedido_params)

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
    if @pedido.discard
      render json: { message: "Registro desactivado con éxito (borrado lógico)" }, status: :ok
    else
      render json: { errors: @cliente.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_pedido
    @pedido = Pedido.find(params[:id])
  end

  def pedido_params
    # Solo permitimos los datos básicos del pedido
    params.require(:pedido).permit(:hora_entrega, :cliente_fk, :estado)
  end
end