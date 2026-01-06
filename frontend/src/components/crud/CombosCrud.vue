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
                  <select v-model="combo.tipo_combo_fk" class="form-select border-2 shadow-none">
                    <option value="" disabled>Seleccionar...</option>
                    <option v-for="tipo in tiposCombo" :key="tipo.id_tipocombo" :value="tipo.id_tipocombo">{{ tipo.nombre }}</option>
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
  </div>
</template>

<script setup>
import { useCombos } from '../composables/useCombos'
import DataTable from '../common/DataTable.vue'
import ModalForm from '../common/ModalForm.vue'

const { 
  combos, pedidos, tiposCombo, bandejas, currentCombo, selectedCombo, agregarComboALista,eliminarComboDeLista,saveMultipleCombos,combosEnCreacion,
  totalAsignado, editing, openCreateModal, openDetailsModal, saveCombo, confirmDelete 
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