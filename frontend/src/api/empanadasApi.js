import { apiEmpanadas } from './index';

export const empanadasService = {
  /* 
  =======================================================================
  RUTAS DE COMBOS
  =======================================================================
  */
  async getCombos() {
    const response = await apiEmpanadas.get('/combos');
    return response.data;
  },
  async getComboById(id) {
    const response = await apiEmpanadas.get(`/combos/${id}`);
    return response.data;
  },
  async createCombo(comboData){
    const response = await apiEmpanadas.post(`/combos`,comboData);
    return response.data; 
  },
  async updateCombo(id,comboData){
    const response = await apiEmpanadas.put(`/combos/${id}`,comboData);
    return response.data;
  },
  async obtenerCombosPorSabor(saborId){
    const response = await apiEmpanadas.get(`/combos/por_sabor/${saborId}`);
    return response.data;
  },
  async deleteCombo(id){
    const response = await apiEmpanadas.delete(`/combos/${id}`);
    return response.data;
  },
  /* 
  =======================================================================
  RUTAS DE Bandejas
  =======================================================================
  */
  async getBandejas() {
    const response = await apiEmpanadas.get('/bandejas');
    return response.data;
  },
  async getBandejaById(id){
    const response = await apiEmpanadas.get(`/bandejas/${id}`);
    return response.data;
  },
  async getBandejasLowStock(){
    const response = await apiEmpanadas.get(`/bandejas/stock/bajo`);
    return response.data
  },
  async createBandeja(bandejaData){
    const response = await apiEmpanadas.post(`/bandejas`,bandejaData);
    return response.data;
  },
  async updateBandeja(id,bandejaData){
    const response = await apiEmpanadas.put(`/bandejas/${id}`,bandejaData);
    return response.data;
  },
  async refillBandeja(id,bandejaData){
    const response = await apiEmpanadas.put(`/bandejas/${id}/llenar_bandeja`,bandejaData);
    return response.data;
  },
  async deleteBandeja(id){
    const response = await apiEmpanadas.delete(`/bandejas/${id}`);
    return response.data;
  },
  /* 
  =======================================================================
  RUTAS DE SABORES
  =======================================================================
  */
  async getSabores() {
    const response = await apiEmpanadas.get('/sabores');
    return response.data;
  },
  async getSaborById(id){
    const response = await apiEmpanadas.get(`/sabores/${id}`);
    return response.data;
  },
  async getMateriasPrimasAnexadasSabor(id){
    const response = await apiEmpanadas.get(`/sabores/${id}/materias_primas`)
    return response.data;
  },
  async createSabor(saborData){
    const response = await apiEmpanadas.post(`/sabores`,saborData);
    return response.data;
  },
  async anexarMateriaPrimaSabor(id,materiaId){
    const response = await apiEmpanadas.post(`/sabores/${id}/agregar_materia`,materiaId)
    return response.data
  },
  async updateSabor(id,saborData){
    const response = await apiEmpanadas.put(`/sabores/${id}`,saborData);
    return response.data;
  },
  async prepararSabor(id,cantidadesData){
    const response = await apiEmpanadas.put(`/sabores/${id}/preparar_sabor`,cantidadesData);
    return response.data;
  },
  async deleteSabor(id){
    const response = await apiEmpanadas.delete(`/sabores/${id}`);
    return response.data;
  },
  /* 
  =======================================================================
  RUTAS DE CLIENTES
  =======================================================================
  */
  async getClientes() {
    const response = await apiEmpanadas.get('/clientes');
    return response.data;
  },

  async getClienteById(id) {
    const response = await apiEmpanadas.get(`/clientes/${id}`);
    return response.data;
  },
  async getPedidosByCliente(id) {
  const response = await apiEmpanadas.get(`/clientes/${id}/pedidos`);
  return response.data;
  },

  async createCliente(clienteData) {
    const response = await apiEmpanadas.post('/clientes', clienteData);
    return response.data;
  },

  async updateCliente(id, clienteData) {
    const response = await apiEmpanadas.put(`/clientes/${id}`, clienteData);
    return response.data;
  },

  async deleteCliente(id) {
    const response = await apiEmpanadas.delete(`/clientes/${id}`);
    return response.data;
  },
  /* 
  =======================================================================
  RUTAS DE MATERIAS PRIMAS
  =======================================================================
  */

  
  async getMateriasPrimas() {
    const response = await apiEmpanadas.get('/materia_primas');
    return response.data;
  },

  
  async getMateriaPrimaById(id) {
    const response = await apiEmpanadas.get(`/materia_primas/${id}`);
    return response.data;
  },

  
  async createMateriaPrima(materiaData) {
    const response = await apiEmpanadas.post('/materia_primas', materiaData);
    return response.data;
  },

  
  async updateMateriaPrima(id, materiaData) {
    const response = await apiEmpanadas.put(`/materia_primas/${id}`, materiaData);
    return response.data;
  },

  
  async deleteMateriaPrima(id) {
    const response = await apiEmpanadas.delete(`/materia_primas/${id}`);
    return response.data;
  },
  async getMateriasPrimasBajoInventario() {
    const response = await apiEmpanadas.get('/materia_primas/inventario/bajo');
    return response.data;
  },
  /* 
  =======================================================================
  RUTAS DE LOTES
  =======================================================================
  */

  
  async getLotes() {
    const response = await apiEmpanadas.get('/lotes');
    return response.data;
  },

  
  async getLoteById(id) {
    const response = await apiEmpanadas.get(`/lotes/${id}`);
    return response.data;
  },

  
  async createLote(loteData) {
    const response = await apiEmpanadas.post('/lotes', loteData);
    return response.data;
  },

  
  async updateLote(id, loteData) {
    const response = await apiEmpanadas.put(`/lotes/${id}`, loteData);
    return response.data;
  },

  
  async deleteLote(id) {
    const response = await apiEmpanadas.delete(`/lotes/${id}`);
    return response.data;
  },

  async agregarSaborALote(loteId, saborId) {
    const response = await apiEmpanadas.post(`/lotes/${loteId}/agregar_sabor`, {
      sabor_id: saborId
    });
    return response.data;
  },
  /* 
  =======================================================================
  RUTAS DE TIPOS DE COMBOS
  =======================================================================
  */
  async getTipoCombos() {
    const response = await apiEmpanadas.get('/tipo_combos');
    return response.data;
  },
  async getTipoComboById(id) {
    const response = await apiEmpanadas.get(`/tipo_combos/${id}`);
    return response.data;
  },
  async createTipoCombo(tipoComboData) {
    const response = await apiEmpanadas.post('/tipo_combos', tipoComboData);
    return response.data;
  },
  async updateTipoCombo(id, tipoComboData) {
    const response = await apiEmpanadas.put(`/tipo_combos/${id}`, tipoComboData);
    return response.data;
  },
  async deleteTipoCombo(id) {
    const response = await apiEmpanadas.delete(`/tipo_combos/${id}`);
    return response.data;
  },
  async getCombosPorTipo(id) {
    const response = await apiEmpanadas.get(`/tipo_combos/${id}/combos`);
    return response.data;
  },
  /* 
  =======================================================================
  RUTAS DE PEDIDOS
  =======================================================================
  */
  async getPedidos() {
    const response = await apiEmpanadas.get('/pedidos');
    return response.data;
  },
  async getPedidoById(id) {
    const response = await apiEmpanadas.get(`/pedidos/${id}`);
    return response.data;
  },
  async createPedido(pedidoData) {
    const response = await apiEmpanadas.post('/pedidos', pedidoData);
    return response.data;
  },
  async updatePedido(id, pedidoData) {
    const response = await apiEmpanadas.put(`/pedidos/${id}`, pedidoData);
    return response.data;
  },
  async deletePedido(id) {
    const response = await apiEmpanadas.delete(`/pedidos/${id}`);
    return response.data;
  },
  async getUsers(){
    const response = await apiEmpanadas.get('/users');
    return response.data;
  },
  async login(name, password) {
  const response = await apiEmpanadas.post('/login', { name, password });
  return response.data;
  }
};