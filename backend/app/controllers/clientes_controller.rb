class ClientesController < ApplicationController
  before_action :set_cliente, only: [:show, :update, :destroy]

  # GET /clientes
  def index
    @clientes = Cliente.all
    render json: @clientes
  end

  # GET /clientes/:id
  def show
    render json: @cliente
  end

  # POST /clientes
  def create
    @cliente = Cliente.new(cliente_params)
    
    # Generar ID único si no se proporciona
    @cliente.id_cliente ||= "CLI-#{SecureRandom.hex(4).upcase}"

    if @cliente.save
      render json: @cliente, status: :created
    else
      render json: @cliente.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /clientes/:id
  def update
    if @cliente.update(cliente_params)
      render json: @cliente
    else
      render json: @cliente.errors, status: :unprocessable_entity
    end
  end

  # DELETE /clientes/:id
  def destroy
    @cliente.destroy
    head :no_content
  end

  # GET /clientes/:id/pedidos
  def pedidos
    @cliente = Cliente.find(params[:id])
    @pedidos = @cliente.pedidos
    render json: @pedidos
  end

  private

  def set_cliente
    @cliente = Cliente.find(params[:id])
  end

  def cliente_params
    params.require(:cliente).permit(:id_cliente, :nombre, :apellido, :telefono, :direccion)
  end
end