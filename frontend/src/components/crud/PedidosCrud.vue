<template>
  <div class="pedidos-section">
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
    </div>

    <div v-else class="d-none d-md-block bg-white rounded-4 shadow-sm overflow-hidden border">
      <table class="table align-middle mb-0">
        <thead class="bg-light">
          <tr>
            <th class="ps-4">ID</th>
            <th>Cliente</th>
            <th>Hora Entrega</th>
            <th>Estado</th>
            <th class="text-end pe-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in pedidos" :key="p.id_pedido" class="border-bottom">
            <td class="ps-4 fw-bold">#{{ p.id_pedido }}</td>
            <td>{{ p.cliente?.nombre || 'Invitado' }}</td>
            <td>{{ formatTime(p.hora_entrega) }}</td>
            <td><span class="badge rounded-pill bg-light text-dark border">{{ p.estado }}</span></td>
            <td class="text-end pe-4">
              <div class="btn-group shadow-sm rounded-pill overflow-hidden">
                <button @click="handleOpenDetails(p.id_pedido)" class="btn btn-white btn-sm px-3"><i class="bi bi-eye text-primary"></i></button>
                <button @click="openEditModal(p)" class="btn btn-white btn-sm px-3"><i class="bi bi-pencil text-warning"></i></button>
                <button @click="confirmDelete(p.id_pedido)" class="btn btn-white btn-sm px-3"><i class="bi bi-trash text-danger"></i></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!isLoading" class="d-md-none">
      <div v-for="p in pedidos" :key="p.id_pedido" class="card border-0 shadow-sm rounded-4 mb-3 border-start border-4 border-warning">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="fw-bold">Pedido #{{ p.id_pedido }}</span>
            <span class="small text-muted">{{ formatTime(p.hora_entrega) }}</span>
          </div>
          <h6 class="card-title fw-bold text-uppercase mb-1">{{ p.cliente?.nombre }}</h6>
          <div class="d-flex gap-2 mt-3">
            <button @click="handleOpenDetails(p.id_pedido)" class="btn btn-primary btn-sm flex-grow-1 rounded-pill">Ver Detalles</button>
            <button @click="openEditModal(p)" class="btn btn-outline-warning btn-sm rounded-circle"><i class="bi bi-pencil"></i></button>
            <button @click="confirmDelete(p.id_pedido)" class="btn btn-outline-danger btn-sm rounded-circle"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="pedidoModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow-lg">
          <div class="modal-header border-0 pb-0">
            <h5 class="fw-bold">{{ editing ? 'Actualizar Pedido' : 'Nuevo Pedido' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted text-uppercase">Cliente</label>
              <select v-model="currentPedido.cliente_fk" class="form-select border-2 shadow-none">
                <option value="" disabled>Seleccionar cliente...</option>
                <option v-for="c in clientes" :key="c.id_cliente" :value="c.id_cliente">
                  {{ c.nombre }} {{ c.apellido }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted text-uppercase">Hora de Entrega</label>
              <input v-model="currentPedido.hora_entrega" type="datetime-local" class="form-control border-2 shadow-none">
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted text-uppercase">Estado</label>
              <select v-model="currentPedido.estado" class="form-select border-2 shadow-none">
                <option value="Pendiente">Pendiente</option>
                <option value="Preparando">Preparando</option>
                <option value="Entregado">Entregado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button @click="savePedido" class="btn btn-warning w-100 rounded-pill fw-bold py-2 shadow-sm">
              {{ editing ? 'Guardar Cambios' : 'Crear Pedido' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="detailsPedidoModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow-lg">
          <div class="modal-header border-0 pb-0">
            <h5 class="fw-bold mb-0">Detalles Pedido #{{ selectedPedido?.id_pedido }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          
          <div class="modal-body">
            <div class="p-3 bg-light rounded-4 mb-4 d-flex align-items-center">
              <div class="bg-warning rounded-circle p-2 me-3">
                <i class="bi bi-person-fill text-white"></i>
              </div>
              <div>
                <p class="small text-muted mb-0 text-uppercase fw-bold" style="font-size: 0.7rem;">Cliente</p>
                <h6 class="fw-bold mb-0">{{ selectedPedido?.cliente?.nombre }} {{ selectedPedido?.cliente?.apellido }}</h6>
              </div>
            </div>

            <h6 class="fw-bold small text-muted text-uppercase mb-3">Resumen de Combos</h6>
            
            <div v-if="selectedPedido?.combos?.length">
              <div v-for="combo in selectedPedido.combos" :key="combo.id_combo" 
                   class="combo-card p-3 mb-3 rounded-4 border-2 shadow-sm"
                   :class="combo.tipo_combo_fk === 1 ? 'border-warning-subtle bg-warning-light' : 'border-light bg-white'">
                
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <span class="fw-bold d-block">{{ combo.cantidad_empanadas }} Empanadas</span>
                    <span class="badge rounded-pill bg-dark-subtle text-dark" style="font-size: 0.65rem;">
                      {{ combo.tipo_combo_fk === 1 ? 'COMBO SIMPLE' : 'VARIADO' }}
                    </span>
                  </div>
                  <span class="fw-bold text-success">${{ combo.precio }}</span>
                </div>

                <div class="sabores-container mt-2">
                  <div v-if="combo.tipo_combo_fk === 1" class="text-center p-2 bg-white rounded-3">
                    <p class="small text-muted mb-0 text-uppercase">Sabor Único</p>
                    <h5 class="fw-bold text-dark mb-0">
                      {{ combo.combo_detalles[0]?.bandeja?.sabor?.nombre || 'Cargando...' }}
                    </h5>
                  </div>

                  <div v-else class="varied-list">
                    <div v-for="det in combo.combo_detalles" :key="det.id_combo_detalle" 
                         class="d-flex justify-content-between align-items-center py-1 border-bottom-dashed small">
                      <span class="text-muted">{{ det.bandeja?.sabor?.nombre }}</span>
                      <span class="fw-bold">{{ det.cantidad_por_sabor }} ud.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-4">
              <i class="bi bi-inbox text-muted fs-2"></i>
              <p class="text-muted small mt-2">Este pedido no tiene combos aún.</p>
            </div>
          </div>
          
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-light w-100 rounded-pill fw-bold" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePedidos } from '../composables/usePedidos'

const { 
  pedidos, clientes, isLoading, editing, currentPedido, selectedPedido,
  openCreateModal, openEditModal, openDetailsModal, savePedido, confirmDelete 
} = usePedidos()

const formatTime = (isoString) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const handleOpenDetails = (id) => {
  openDetailsModal(id);
};

defineExpose({ openCreateModal });
</script>

