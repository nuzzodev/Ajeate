<template>
  <div class="combos-section">
    <DataTable :columns="columns" :data="combos" primaryKey="id_combo" :showEdit="false" :showDelete="false" :showDetail="true" @view="openDetailsModal" />

    <ModalForm
      modalId="comboModal"
      :title="editing ? 'Editar Combo' : 'Gestión de Combos'"
      :editing="editing"
      @submit="saveMultipleCombos"
    >
      <div class="col-12 mb-4">
        <label class="form-label fw-bold small text-muted text-uppercase">Asignar a Pedido Principal</label>
        <select v-model="currentCombo.pedido_fk" class="form-select border-2 border-warning shadow-none">
          <option value="" disabled>Seleccionar pedido...</option>
          <option v-for="p in pedidos" :key="p.id_pedido" :value="p.id_pedido">
            Pedido #{{ p.id_pedido }} - {{ p.cliente?.nombre }}
          </option>
        </select>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0 text-muted">CONFIGURACIÓN DE COMBOS</h6>
        <button type="button" @click="agregarComboALista" class="btn btn-sm btn-warning rounded-pill px-3 fw-bold">
          <i class="bi bi-plus-circle me-1"></i> Añadir Combo
        </button>
      </div>

      <div class="accordion" id="accordionCombos">
        <div v-for="(combo, index) in combosEnCreacion" :key="combo.uuid" class="accordion-item mb-3 border rounded-4 overflow-hidden shadow-sm">
          <h2 class="accordion-header">
            <button class="accordion-button fw-bold bg-light text-dark shadow-none" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + index">
              <span class="badge bg-warning text-dark me-2">{{ index + 1 }}</span>
              Combo - {{ combo.cantidad_empanadas }} Unds.
              <span v-if="combosEnCreacion.length > 1" @click.stop="eliminarComboDeLista(index)" class="ms-auto text-danger px-2 border-0 bg-transparent">
                <i class="bi bi-trash"></i>
              </span>
            </button>
          </h2>
          
          <div :id="'collapse' + index" class="accordion-collapse collapse show" data-bs-parent="#accordionCombos">
            <div class="accordion-body bg-white">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted text-uppercase">Categoría</label>
                  <select 
                    v-model="combo.tipo_combo_fk" 
                    @change="() => autoRellenarCombo(combo)"
                    class="form-select border-2 shadow-none"
                  >
                    <option value="" disabled>Seleccionar...</option>
                    <option v-for="tipo in tiposCombo" :key="tipo.id_tipocombo" :value="tipo.id_tipocombo">
                      {{ tipo.nombre }}
                    </option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted text-uppercase">Cantidad</label>
                  <input v-model.number="combo.cantidad_empanadas" type="number" class="form-control border-2 shadow-none text-center fw-bold">
                </div>

                <div v-if="combo.tipo_combo_fk === 1" class="col-12 mt-3">
                  <div class="p-2 bg-light rounded-3 border">
                    <label class="fw-bold small text-muted d-block text-center mb-2">Selecciona Bandeja Única</label>
                    <div class="row g-2">
                      <div v-for="bandeja in bandejas" :key="bandeja.id_bandeja" class="col-6">
                        <input 
                          type="radio" 
                          class="btn-check" 
                          :name="'bandeja_' + combo.uuid" 
                          :id="'b_' + combo.uuid + bandeja.id_bandeja" 
                          :value="bandeja.id_bandeja"
                          :checked="combo.sabores_seleccionados[bandeja.id_bandeja] === combo.cantidad_empanadas"
                          @change="combo.sabores_seleccionados = { [bandeja.id_bandeja]: combo.cantidad_empanadas }"
                        >
                        <label class="btn btn-outline-warning btn-sm w-100 py-2 rounded-3" :for="'b_' + combo.uuid + bandeja.id_bandeja">
                          <div class="fw-bold">{{ bandeja.sabor?.nombre }}</div>
                          <div class="small opacity-75">Stock: {{ bandeja.cantidad_disponible }}</div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="combo.tipo_combo_fk && combo.tipo_combo_fk !== 1" class="col-12 mt-3">
                   <div class="list-group">
                      <div v-for="bandeja in bandejas" :key="bandeja.id_bandeja" class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-1 bg-transparent">
                        <span class="small fw-medium">{{ bandeja.sabor?.nombre }} ({{ bandeja.cantidad_disponible }})</span>
                        <input 
                          type="number" 
                          v-model.number="combo.sabores_seleccionados[bandeja.id_bandeja]" 
                          class="form-control form-control-sm w-25 border-2" 
                          min="0"
                        >
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalForm>
    <div class="modal fade" id="detailsComboModal" tabindex="-1" aria-labelledby="detailsComboModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 overflow-hidden shadow-lg">
          <div class="modal-header bg-warning text-dark border-0">
            <h5 class="modal-title fw-bold" id="detailsComboModalLabel">
              <i class="bi bi-eye me-2"></i>Detalles del Combo
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          
          <div class="modal-body p-4">
            <div v-if="selectedCombo">
              <!-- Información Principal -->
              <div class="row mb-4">
                <div class="col-md-6">
                  <div class="card border-0 bg-light rounded-3 p-3 h-100">
                    <h6 class="fw-bold text-muted mb-3">INFORMACIÓN GENERAL</h6>
                    <div class="d-flex flex-column">
                      <span class="small text-muted">ID Combo</span>
                      <span class="fw-bold fs-5 text-dark">#{{ selectedCombo.id_combo }}</span>
                    </div>
                    <div class="mt-3">
                      <span class="small text-muted">Categoría</span>
                      <div class="fw-bold text-warning">{{ selectedCombo.tipo_combo?.nombre }}</div>
                    </div>
                    <div class="mt-3">
                      <span class="small text-muted">Cantidad Total</span>
                      <div class="fw-bold fs-4">{{ selectedCombo.cantidad_empanadas }} unidades</div>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="card border-0 bg-light rounded-3 p-3 h-100">
                    <h6 class="fw-bold text-muted mb-3">DATOS DEL PEDIDO</h6>
                    <div class="d-flex flex-column">
                      <span class="small text-muted">Pedido Asociado</span>
                      <span class="fw-bold">Pedido #{{ selectedCombo.pedido_fk }}</span>
                    </div>
                    <div class="mt-4">
                      <span class="small text-muted">Precio Total</span>
                      <div class="fw-bold fs-4 text-success">${{ selectedCombo.precio }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Detalles de Sabores -->
              <div class="card border-0 bg-white rounded-3 overflow-hidden">
                <div class="card-header bg-dark text-white fw-bold">
                  <i class="bi bi-list-check me-2"></i>SABORES INCLUIDOS
                </div>
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <div 
                      v-for="sabor in selectedCombo.sabores_info" 
                      :key="sabor.id_sabor"
                      class="list-group-item d-flex justify-content-between align-items-center py-3 border-bottom"
                    >
                      <div class="d-flex align-items-center">
                        <div class="bg-warning rounded-circle p-2 me-3">
                          <i class="bi bi-egg-fried text-dark"></i>
                        </div>
                        <div>
                          <div class="fw-bold">{{ sabor.nombre }}</div>
                          <small class="text-muted">ID Sabor: {{ sabor.id_sabor }}</small>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="badge bg-warning text-dark fs-6 px-3 py-2">
                          {{ sabor.cantidad }} unidades
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-5">
              <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
              <p class="mt-3 text-muted">Cargando detalles del combo...</p>
            </div>
          </div>
          
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-1"></i>Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup>
import { useCombos } from '../composables/useCombos'
import DataTable from '../common/DataTable.vue'
import ModalForm from '../common/ModalForm.vue'

const { 
  combos, pedidos, tiposCombo, bandejas, currentCombo, selectedCombo, 
  agregarComboALista, eliminarComboDeLista, saveMultipleCombos, combosEnCreacion,
  totalAsignado, editing, openCreateModal, openDetailsModal, saveCombo,autoRellenarCombo
} = useCombos()

const columns = [
  { key: 'id_combo', label: 'ID', class: 'fw-bold text-center', width: '80px' },
  { key: 'tipo_combo.nombre', label: 'CATEGORÍA', class: 'fw-bold text-warning' },
  { key: 'cantidad_empanadas', label: 'UNIDADES', class: 'text-center fw-medium' },
  { 
    key: 'pedido', 
    label: 'PEDIDO ASOCIADO', 
    format: (row) => `Pedido #${row.pedido_fk || row.pedido?.id_pedido}` 
  },
  { 
    key: 'precio', 
    label: 'PRECIO', 
    format: (row) => `$${row.precio}`,
    class: 'text-success fw-bold'
  }
]

defineExpose({ openCreateModal })
</script>

<style scoped>
.border-bottom-dashed {
  border-bottom: 1px dashed #dee2e6;
}
.list-group-item:last-child {
  border-bottom: none;
}
</style>