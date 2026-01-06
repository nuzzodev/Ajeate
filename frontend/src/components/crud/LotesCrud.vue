<template>
  <div class="lotes-section">
    <div class="mb-4 d-flex align-items-center justify-content-between p-3 bg-white rounded-4 shadow-sm border-start border-4 border-warning">
      <div>
        <span class="text-muted small fw-bold text-uppercase d-block">Control de Producción</span>
        <h4 class="fw-bold mb-0">{{ lotes.length }} Lotes Registrados</h4>
      </div>
      <div class="bg-light p-3 rounded-circle">
        <i class="bi bi-stack text-warning fs-4"></i>
      </div>
    </div>

    <div class="ajeate-card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
      <DataTable
        :columns="columns"
        :data="lotes"
        primaryKey="id_lote"
        :showEdit="false"
        :showDelete="false"
        :showDetail="true"
        @view="openDetailsModal"
      />
    </div>

    <div class="modal fade" id="detailsModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4">
          <div class="modal-header border-0 pb-0">
            <h5 class="fw-bold">Detalles del Lote #{{ selectedLote?.id_lote }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4">
            <label class="text-muted small fw-bold text-uppercase d-block mb-2">Sabores incluidos:</label>
            <div class="list-group list-group-flush border rounded-3 mb-4">
              <div v-for="sl in selectedLote?.sabor_lotes" :key="sl.id_sabor_lote" class="list-group-item">
                <i class="bi bi-patch-check text-warning me-2"></i>
                {{ getSaborName(sl.sabor_fk) }}
              </div>
            </div>
            <div class="bg-light p-3 rounded-3 text-center">
              <span class="text-muted small d-block">PRODUCCIÓN TOTAL</span>
              <span class="h4 fw-bold mb-0">{{ selectedLote?.cantidad_lote }} Unidades</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalForm
      modalId="loteModal"
      :title="editing ? 'Actualizar Lote' : 'Registrar Lote'"
      :editing="editing"
      @submit="saveLote"
    >
      <div class="row g-3">
        <div class="col-12">
          <label class="form-label fw-bold small text-muted">CANTIDAD TOTAL DEL LOTE</label>
          <div class="input-group">
            <span class="input-group-text bg-light border-2"><i class="bi bi-hash"></i></span>
            <input v-model.number="currentLote.cantidad_lote" type="number" class="form-control form-control-lg border-2 shadow-none" placeholder="0">
          </div>
        </div>
        <div class="col-12">
          <label class="form-label fw-bold small text-muted">SELECCIÓN DE SABORES</label>
          <div class="p-3 border-2 rounded-3 bg-light-subtle" style="max-height: 250px; overflow-y: auto;">
            <div v-for="sabor in sabores" :key="sabor.id_sabor" class="form-check mb-2 custom-checkbox">
              <input 
                class="form-check-input border-secondary" 
                type="checkbox" 
                :value="sabor.id_sabor" 
                v-model="currentLote.sabores_seleccionados"
                :id="'sabor' + sabor.id_sabor"
              >
              <label class="form-check-label d-flex justify-content-between w-100" :for="'sabor' + sabor.id_sabor">
                <span>{{ sabor.nombre }}</span>
                <span class="text-muted small">{{ sabor.marca || '' }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </ModalForm>
  </div>
</template>

<script setup>
import { useLotes } from '../composables/useLotes'
import DataTable from '../common/DataTable.vue'
import ModalForm from '../common/ModalForm.vue'

const { 
  lotes, sabores, currentLote, editing, 
  openCreateModal, saveLote, openDetailsModal, selectedLote 
} = useLotes()

const columns = [
  { key: 'id_lote', label: 'ID', class: 'fw-bold text-center', width: '80px' },
  { key: 'cantidad_lote', label: 'CANTIDAD UNIDADES', class: 'text-center' },
  { 
    key: 'sabor_lotes', 
    label: 'DIVERSIDAD DE SABORES', 
    format: (row) => `${row.sabor_lotes?.length || 0} Sabores incluidos`,
    class: 'text-primary fw-medium'
  }
]

// Función para obtener nombre del sabor desde la lista cargada
const getSaborName = (id) => {
  const s = sabores.value.find(s => s.id_sabor === id)
  return s ? s.nombre : 'Sabor no identificado'
}

defineExpose({ openCreateModal })
</script>