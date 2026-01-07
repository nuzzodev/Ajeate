<template>
  <div class="pedidos-section">
    <div class="mb-4 d-flex align-items-center justify-content-between p-3 bg-white rounded-4 shadow-sm border-start border-4 border-warning">
      <div>
        <span class="text-muted small fw-bold text-uppercase d-block">Pedidos Activos</span>
        <h4 class="fw-bold mb-0">{{ pedidos.length }} Pedidos</h4>
      </div>
      <div class="bg-light p-3 rounded-circle">
        <i class="bi bi-clock-history text-warning fs-4"></i>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
    </div>

    <div v-else>
      <div class="d-none d-md-block ajeate-card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
        <DataTable
          :columns="columns"
          :data="pedidos"
          primaryKey="id_pedido"
          :showEdit="true"
          :showDelete="true"
          :showDetail="true"
          @edit="openEditModal"
          @delete="confirmDelete"
          @view="handleViewDetails"
        />
      </div>

      <div class="d-md-none">
        <div v-for="p in pedidos" :key="p.id_pedido" class="card border-0 shadow-sm rounded-4 mb-3 border-start border-4 border-warning">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 class="fw-bold mb-0 text-dark">Pedido #{{ p.id_pedido }}</h5>
                <span class="badge bg-light text-muted border mt-1">{{ p.cliente?.nombre || 'Invitado' }}</span>
              </div>
              
              <div class="d-flex gap-2">
                <button 
                  @click="() => handleOpenDetails(p.id_pedido)" 
                  class="btn btn-primary btn-sm rounded-circle shadow-sm action-btn"
                  title="Ver Detalles"
                >
                  <i class="bi bi-eye-fill"></i>
                </button>
                <button 
                  @click="openEditModal(p)" 
                  class="btn btn-warning btn-sm rounded-circle shadow-sm action-btn"
                  title="Editar"
                >
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <button 
                  @click="confirmDelete(p.id_pedido)" 
                  class="btn btn-outline-danger btn-sm rounded-circle shadow-sm action-btn"
                  title="Eliminar"
                >
                  <i class="bi bi-trash3-fill"></i>
                </button>
              </div>
            </div>
            
            <div class="mb-2 small d-flex align-items-center">
              <div class="icon-circle-small me-2">
                <i class="bi bi-clock-fill text-warning"></i>
              </div>
              <span class="text-secondary">{{ formatTime(p.hora_entrega) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalForm
      modalId="pedidoModal"
      :title="editing ? 'Actualizar Pedido' : 'Nuevo Pedido'"
      :editing="editing"
      @submit="savePedido"
    >
      <div class="row g-3">
        <div class="col-12">
          <label class="form-label fw-bold small text-muted">CLIENTE</label>
          <select v-model="currentPedido.cliente_fk" class="form-select form-select-lg border-2 shadow-none">
            <option value="" disabled>Seleccionar cliente...</option>
            <option v-for="c in clientes" :key="c.id_cliente" :value="c.id_cliente">
              {{ c.nombre }} {{ c.apellido }}
            </option>
          </select>
        </div>
        <div class="col-12">
          <label class="form-label fw-bold small text-muted">HORA DE ENTREGA</label>
          <input v-model="currentPedido.hora_entrega" type="datetime-local" class="form-control form-control-lg border-2 shadow-none">
        </div>
      </div>
    </ModalForm>

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
import DataTable from '../common/DataTable.vue'
import ModalForm from '../common/ModalForm.vue'

const { 
  pedidos, clientes, isLoading, editing, currentPedido, selectedPedido,
  openCreateModal, openEditModal, openDetailsModal, savePedido, confirmDelete 
} = usePedidos()

const formatTime = (isoString) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Función para la vista móvil (usa ID directamente)
const handleOpenDetails = (id) => {
  openDetailsModal(id);
};

// Función para DataTable (recibe el objeto completo)
const handleViewDetails = (pedido) => {
  openDetailsModal(pedido.id_pedido);
};

const columns = [
  { key: 'id_pedido', label: 'ID', class: 'fw-bold', width: '100px', format: (row) => `#${row.id_pedido}` },
  { 
    key: 'cliente', 
    label: 'CLIENTE', 
    format: (row) => row.cliente?.nombre || 'Invitado' 
  },
  { 
    key: 'hora_entrega', 
    label: 'HORA ENTREGA', 
    format: (row) => formatTime(row.hora_entrega) 
  }
]

defineExpose({ openCreateModal });
</script>

