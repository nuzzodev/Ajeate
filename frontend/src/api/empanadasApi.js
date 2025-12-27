import { apiEmpanadas } from './index';

export const empanadasService = {
  // Combos
  async getCombos() {
    const response = await apiEmpanadas.get('/combos');
    return response.data;
  },

  async getComboById(id) {
    const response = await apiEmpanadas.get(`/combos/${id}`);
    return response.data;
  },

  // Bandejas
  async getBandejas() {
    const response = await apiEmpanadas.get('/bandejas');
    return response.data;
  },

  // Sabores
  async getSabores() {
    const response = await apiEmpanadas.get('/sabores');
    return response.data;
  },

  // Para landing page: combos destacados
  async getCombosDestacados() {
    const response = await apiEmpanadas.get('/combos/destacados');
    return response.data;
  },

  // Si no existe el endpoint destacados, usar todos con límite
  async getCombosParaCarrusel(limit = 6) {
    const combos = await this.getCombos();
    return combos.slice(0, limit);
  }
};