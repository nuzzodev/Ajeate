<template>
  <div class="materias-section">
    <div class="mb-4 d-flex align-items-center justify-content-between p-3 bg-white rounded-4 shadow-sm border-start border-4 border-warning">
      <div>
        <span class="text-muted small fw-bold text-uppercase d-block">Materia Prima en Stock</span>
        <h4 class="fw-bold mb-0">{{ materias.length }} Insumos</h4>
      </div>
      <div class="bg-light p-3 rounded-circle">
        <i class="bi bi-box-seam-fill text-warning fs-4"></i>
      </div>
    </div>

    <div class="d-none d-md-block ajeate-card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
      <DataTable
        :columns="columns"
        :data="materias"
        primaryKey="id_materia_prima"
        @edit="openEditModal"
        @delete="confirmDelete"
      />
    </div>

    <div class="d-md-none">
      <div v-for="materia in materias" :key="materia.id_materia_prima" class="card border-0 shadow-sm rounded-4 mb-3 overflow-hidden">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 class="fw-bold mb-0 text-dark">{{ materia.nombre }}</h5>
              <span class="badge bg-warning text-dark mt-1">{{ materia.marca }}</span>
            </div>
            <div class="d-flex gap-2">
              <button @click="openEditModal(materia)" class="btn btn-warning btn-sm rounded-circle shadow-sm"><i class="bi bi-pencil-fill"></i></button>
              <button @click="confirmDelete(materia)" class="btn btn-outline-danger btn-sm rounded-circle shadow-sm"><i class="bi bi-trash3-fill"></i></button>
            </div>
          </div>
          <div class="d-flex align-items-center justify-content-between bg-light p-2 rounded-3">
            <span class="small text-muted">Stock Disponible:</span>
            <span class="fw-bold text-dark">{{ materia.cantidad }} Unids</span>
          </div>
        </div>
      </div>
    </div>

    <ModalForm
      modalId="materiaModal"
      :title="editing ? 'Modificar Insumo' : 'Nuevo Insumo'"
      :editing="editing"
      @submit="saveMateria"
    >
      <div class="row g-3">
        <div class="col-12">
          <label class="form-label fw-bold small text-muted">NOMBRE DEL INSUMO</label>
          <input v-model="currentMateria.nombre" type="text" class="form-control form-control-lg border-2 shadow-none" placeholder="Ej. Harina de Maíz">
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label fw-bold small text-muted">MARCA</label>
          <input v-model="currentMateria.marca" type="text" class="form-control form-control-lg border-2 shadow-none" placeholder="Ej. PAN">
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label fw-bold small text-muted">CANTIDAD EN STOCK</label>
          <input v-model.number="currentMateria.cantidad" type="number" class="form-control form-control-lg border-2 shadow-none">
        </div>
      </div>
    </ModalForm>
  </div>
</template>

<script setup>
import { useMateriasPrimas } from '../composables/useMateriasPrimas'
import DataTable from '../common/DataTable.vue'
import ModalForm from '../common/ModalForm.vue'

const { 
  materias, currentMateria, editing, 
  openCreateModal, openEditModal, saveMateria, confirmDelete 
} = useMateriasPrimas()

const columns = [
  { key: 'nombre', label: 'INSUMO', class: 'fw-bold' },
  { key: 'marca', label: 'MARCA' },
  { 
    key: 'cantidad', 
    label: 'CANTIDAD', 
    format: (row) => `${row.cantidad} Unids`,
    class: (row) => row.cantidad < 10 ? 'text-danger fw-bold' : '' 
  }
]

defineExpose({ openCreateModal })
</script>