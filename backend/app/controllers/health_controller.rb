
class HealthController < ApplicationController
  def check
    render json: {
      status: 'OK',
      timestamp: Time.current.iso8601,
      environment: Rails.env,
      database: {
        connected: true,
        clientes: Cliente.count,
        pedidos: Pedido.count,
        sabores: Sabor.count,
        bandejas: Bandeja.count
      }
    }
  end
end