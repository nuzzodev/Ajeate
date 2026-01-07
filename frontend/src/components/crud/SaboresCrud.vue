<template>
  <div class="sabores-section">
    <div class="mb-4 d-flex align-items-center justify-content-between p-3 bg-white rounded-4 shadow-sm border-start border-4 border-warning">
      <div>
        <span class="text-muted small fw-bold text-uppercase d-block">Inventario de Sabores</span>
        <h4 class="fw-bold mb-0">{{ sabores.length }} Sabores</h4>
      </div>
      <div class="bg-light p-3 rounded-circle">
        <i class="bi bi-egg-fried text-warning fs-4"></i>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
    </div>

    <div v-else>
      <div class="d-none d-md-block ajeate-card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
        <DataTable
          :columns="columns"
          :data="sabores"
          primaryKey="id_sabor"
          :showEdit="true"
          :showDelete="true"
          :showDetail="true"
          :showPrepare="true"
          @edit="openEditModal"
          @delete="confirmDelete"
          @view="openDetailsModal"
          @prepare="openProductionModal"
        />
      </div>

      <div class="d-md-none px-2">
  <div v-for="s in sabores" :key="s.id_sabor" 
       class="card border-0 shadow-sm rounded-4 mb-3 overflow-hidden">
    
    <div :class="getStockClass(s)" style="height: 6px; width: 100%;"></div>

    <div class="card-body p-3">
      <div class="d-flex align-items-center mb-3">
        <div class="position-relative">
          <img :src="getImageUrl(s.imagen_url)" :alt="s.nombre" 
               class="rounded-3 object-fit-cover shadow-sm" 
               style="width: 55px; height: 55px;">
          <span class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-dark border border-white" style="font-size: 0.6rem;">
            #{{ s.id_sabor }}
          </span>
        </div>
        
        <div class="ms-3 flex-grow-1">
          <h6 class="fw-bold mb-0 text-dark text-truncate" style="max-width: 150px;">{{ s.nombre }}</h6>
          <div :class="getStockTextClass(s.cantidad)" class="small fw-bold">
            <i class="bi bi-box-seam me-1"></i>{{ parseFloat(s.cantidad).toFixed(1) }} unidades
          </div>
        </div>

        <button @click="openProductionModal(s)" 
                class="btn btn-warning rounded-3 px-3 py-2 shadow-sm border-0">
          <i class="bi bi-hammer fs-5"></i>
        </button>
      </div>

      <hr class="text-muted opacity-25 my-2">

      <div class="d-flex justify-content-between align-items-center mt-2">
        <span class="text-muted extra-small text-uppercase fw-bold">Gestión</span>
        <div class="d-flex gap-2">
          <button @click="openDetailsModal(s)" class="btn btn-light btn-sm rounded-circle border shadow-sm action-btn-mobile">
            <i class="bi bi-eye text-primary"></i>
          </button>
          <button @click="openEditModal(s)" class="btn btn-light btn-sm rounded-circle border shadow-sm action-btn-mobile">
            <i class="bi bi-pencil text-dark"></i>
          </button>
          <button @click="confirmDelete(s)" class="btn btn-light btn-sm rounded-circle border shadow-sm action-btn-mobile">
            <i class="bi bi-trash3 text-danger"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>

    <!-- Modal para Crear/Editar -->
    <ModalForm
      modalId="saborModal"
      :title="editing ? 'Actualizar Sabor' : 'Nuevo Sabor'"
      :editing="editing"
      @submit="saveSabor"
    >
      <div class="row g-3">
        <div class="col-12">
          <label class="form-label fw-bold small text-muted">NOMBRE DEL SABOR</label>
          <input v-model="currentSabor.nombre" type="text" class="form-control form-control-lg border-2 shadow-none" placeholder="Ej: Queso, Carne Mechada...">
        </div>
        
        <div class="col-12">
          <label class="form-label fw-bold small text-muted">STOCK INICIAL</label>
          <input v-model.number="currentSabor.cantidad" type="number" step="0.1" min="0" class="form-control form-control-lg border-2 shadow-none" placeholder="Cantidad en unidades">
        </div>
        
        <div class="col-12">
          <label class="form-label fw-bold small text-muted">IMAGEN (URL)</label>
          <div class="input-group">
            <input v-model="currentSabor.imagen_url" type="text" class="form-control border-2 shadow-none" placeholder="/images/sabores/default.jpg">
            <button type="button" class="btn btn-outline-secondary" @click="currentSabor.imagen_url = '/images/sabores/default.jpg'">
              Default
            </button>
          </div>
          <div v-if="currentSabor.imagen_url" class="mt-2">
            <div class="d-flex align-items-center gap-3">
              <div class="image-preview rounded-3 overflow-hidden" style="width: 80px; height: 80px;">
                <img :src="getImageUrl(currentSabor.imagen_url)" :alt="currentSabor.nombre" class="w-100 h-100 object-fit-cover">
              </div>
              <span class="small text-muted">Vista previa</span>
            </div>
          </div>
        </div>

        <!-- SECCIÓN DE MATERIAS PRIMAS -->
        <div class="col-12 mt-4">
          <h6 class="fw-bold small text-muted text-uppercase mb-3">
            <i class="bi bi-check2-all me-2"></i>SELECCIONAR MATERIAS PRIMAS
          </h6>
          
          <div class="card border-0 bg-light rounded-4 overflow-hidden">
            <div class="list-group list-group-flush">
              <div v-for="(materia, index) in currentSabor.sabor_materias_attributes" 
                  :key="index"
                  class="list-group-item bg-transparent border-bottom px-3 py-3">
                
                <div class="d-flex align-items-center justify-content-between gap-3">
                  <div class="form-check mb-0 flex-grow-1">
                    <input 
                      class="form-check-input border-2 border-warning cursor-pointer" 
                      type="checkbox" 
                      v-model="materia.selected"
                      :id="'mp-' + index"
                    >
                    <label class="form-check-label fw-bold cursor-pointer" :for="'mp-' + index">
                      {{ materia.materia_prima_nombre }}
                    </label>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
          <p class="text-muted extra-small mt-2 px-2">
            * Solo las materias primas marcadas serán vinculadas al sabor.
          </p>
        </div>
      </div>
    </ModalForm>

    <!-- Modal para Ver Detalles -->
    <div class="modal fade" id="detailsSaborModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow-lg">
          <div class="modal-header border-0 pb-0">
            <h5 class="fw-bold mb-0">Detalles del Sabor #{{ selectedSabor?.id_sabor }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          
          <div class="modal-body p-4">
            <div v-if="selectedSabor">
              <!-- Información Principal -->
              <div class="row mb-4">
                <div class="col-md-4">
                  <div class="sabor-image text-center mb-3">
                    <div class="image-container mx-auto rounded-4 overflow-hidden" style="width: 150px; height: 150px;">
                      <img :src="getImageUrl(selectedSabor.imagen_url)" 
                           :alt="selectedSabor.nombre" 
                           class="w-100 h-100 object-fit-cover">
                    </div>
                  </div>
                </div>
                
                <div class="col-md-8">
                  <div class="card border-0 bg-light rounded-3 p-3 h-100">
                    <h3 class="fw-bold text-dark mb-3">{{ selectedSabor.nombre }}</h3>
                    
                    <div class="d-flex gap-4 mb-3">
                      <div>
                        <span class="small text-muted d-block">ID</span>
                        <span class="fw-bold fs-5">#{{ selectedSabor.id_sabor }}</span>
                      </div>
                      <div>
                        <span class="small text-muted d-block">Stock Actual</span>
                        <span class="fw-bold fs-5" :class="getStockTextClass(selectedSabor.cantidad)">
                          {{ parseFloat(selectedSabor.cantidad).toFixed(1) }} unidades
                        </span>
                      </div>
                    </div>
                    
                    <div class="mt-3">
                      <span class="small text-muted">URL de Imagen</span>
                      <div class="text-truncate text-muted">{{ selectedSabor.imagen_url || '/images/sabores/default.jpg' }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Materias Primas Anexadas -->
              <div class="card border-0 bg-white rounded-3 overflow-hidden">
                <div class="card-header bg-dark text-white fw-bold">
                  <i class="bi bi-box-seam me-2"></i>MATERIAS PRIMAS REQUERIDAS
                </div>
                <div class="card-body p-0">
                  <div v-if="materiasAnexadas.length > 0">
                    <div class="list-group list-group-flush">
                      <div v-for="materia in materiasAnexadas" 
                           :key="materia.id_materia_prima"
                           class="list-group-item d-flex justify-content-between align-items-center py-3 border-bottom">
                        <div class="d-flex align-items-center">
                          <div class="bg-warning rounded-circle p-2 me-3">
                            <i class="bi bi-box text-dark"></i>
                          </div>
                          <div>
                            <div class="fw-bold">{{ materia.nombre }}</div>
                            <small class="text-muted">ID: {{ materia.id_materia_prima }}</small>
                          </div>
                        </div>
                        <div class="text-end">
                          <div class="badge bg-warning text-dark fs-6 px-3 py-2">
                            {{ materia.cantidad_a_descontar }} Kg
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center py-5">
                    <i class="bi bi-box-seam text-muted fs-1"></i>
                    <p class="text-muted mt-3">Este sabor no tiene materias primas asignadas</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-5">
              <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
              <p class="mt-3 text-muted">Cargando detalles del sabor...</p>
            </div>
          </div>
          
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-light w-100 rounded-pill fw-bold" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="productionModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content border-0 shadow-lg rounded-4">
      <div class="modal-header bg-dark text-white border-0">
        <h5 class="modal-title fw-bold">
          <i class="bi bi-hammer me-2 text-warning"></i>
          Producción: {{ selectedSabor?.nombre }}
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body p-4">
        <div class="mb-4">
          <label class="form-label fw-bold small text-muted">CANTIDAD DE SABOR PRODUCIDA</label>
          <div class="input-group">
            <input v-model.number="productionData.cantidad_final" type="number" class="form-control form-control-lg border-2 shadow-none border-warning" placeholder="Ej: 50">
            <span class="input-group-text bg-warning border-warning fw-bold text-dark">Unidades</span>
          </div>
        </div>

        <hr class="my-4">

        <h6 class="fw-bold small text-muted text-uppercase mb-3">Materias Primas Gastadas</h6>
        <div class="card border-0 bg-light rounded-3 overflow-hidden">
          <div v-for="ing in productionData.ingredientes" :key="ing.materia_prima_id" class="p-3 border-bottom d-flex align-items-center justify-content-between bg-white mb-1">
            <span class="fw-bold">{{ ing.nombre }}</span>
            <div class="input-group" style="width: 140px;">
              <input v-model.number="ing.cantidad" type="number" step="0.01" class="form-control form-control-sm text-end border-2" placeholder="0.0">
              <span class="input-group-text small bg-light">Kg</span>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer border-0 p-4">
        <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancelar</button>
        <button @click="submitProduction" type="button" class="btn btn-warning rounded-pill px-4 fw-bold shadow-sm">
          Registrar y Descontar
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { useSabores } from '../composables/useSabores'
import DataTable from '../common/DataTable.vue'
import ModalForm from '../common/ModalForm.vue'

const { 
  sabores, materiasPrimas, materiasAnexadas, currentSabor, selectedSabor, 
  editing, isLoading,
  openCreateModal, openEditModal, openDetailsModal, saveSabor, confirmDelete, 
  getImageUrl, actualizarCantidadMateria, getMateriaPrimaNombre, getStockTextClass,
  productionData, openProductionModal, submitProduction
} = useSabores()

const columns = [
  { 
    key: 'id_sabor', 
    label: 'ID', 
    class: 'fw-bold text-center', 
    width: '80px' 
  },
  { 
    key: 'nombre', 
    label: 'SABOR', 
    class: 'fw-bold' 
  },
  { 
    key: 'cantidad', 
    label: 'STOCK', 
    format: (row) => `${parseFloat(row.cantidad).toFixed(1)} ud.`,
    class: (row) => getStockTextClass(row.cantidad) + ' fw-bold'
  }
]

const getStockClass = (sabor) => {
  const cantidad = parseFloat(sabor.cantidad)
  if (cantidad === 0) return 'border-danger'
  if (cantidad < 5) return 'border-warning'
  return 'border-success'
}

defineExpose({ openCreateModal })
</script>

