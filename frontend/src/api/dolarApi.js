import { dolarApi } from './index';

export const tasaService = {
  // Obtener tasa actual del dólar
  async getTasaActual() {
    try {
      const response = await dolarApi.get('/exchange-rate');
      return {
        tasaUSD: response.data.current.usd,
        tasaEUR: response.data.current.eur,
        fecha: response.data.current.date,
        cambioPorcentajeUSD: response.data.changePercentage.usd
      };
    } catch (error) {
      console.error('Error obteniendo tasa del dólar:', error);
      // Retornar tasa por defecto si hay error
      return {
        tasaUSD: 291.35, // Tasa por defecto
        tasaEUR: 342.94,
        fecha: new Date().toISOString().split('T')[0],
        cambioPorcentajeUSD: 0
      };
    }
  },

  // Obtener solo la tasa USD (más simple)
  async getTasaUSD() {
    const data = await this.getTasaActual();
    return data.tasaUSD;
  }
};