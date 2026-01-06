<template>
  <div class="clientes-section">
    <div class="mb-4 d-flex align-items-center justify-content-between p-3 bg-white rounded-4 shadow-sm border-start border-4 border-warning">
      <div>
        <span class="text-muted small fw-bold text-uppercase d-block">Total Registrados</span>
        <h4 class="fw-bold mb-0">{{ clientes.length }} Clientes</h4>
      </div>
      <div class="bg-light p-3 rounded-circle">
        <i class="bi bi-people-fill text-warning fs-4"></i>
      </div>
    </div>

    <div class="d-none d-md-block ajeate-card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
      <DataTable
        :columns="columns"
        :data="clientes"
        primaryKey="id_cliente"
        @edit="openEditModal"
        @delete="confirmDelete"
      />
    </div>

    <div class="d-md-none">
      <div v-for="cliente in clientes" :key="cliente.id_cliente" class="card border-0 shadow-sm rounded-4 mb-3 overflow-hidden">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h5 class="fw-bold mb-0 text-dark">{{ cliente.nombre }} {{ cliente.apellido }}</h5>
              <span class="badge bg-light text-muted border mt-1">ID: {{ cliente.id_cliente }}</span>
            </div>
            
            <div class="d-flex gap-2">
              <button 
                @click="openEditModal(cliente)" 
                class="btn btn-warning btn-sm rounded-circle shadow-sm action-btn"
                title="Editar"
              >
                <i class="bi bi-pencil-fill"></i>
              </button>
              <button 
                @click="confirmDelete(cliente)" 
                class="btn btn-outline-danger btn-sm rounded-circle shadow-sm action-btn"
                title="Eliminar"
              >
                <i class="bi bi-trash3-fill"></i>
              </button>
            </div>
          </div>
          
          <div class="mb-2 small d-flex align-items-center">
            <div class="icon-circle-small me-2">
              <i class="bi bi-telephone-fill text-warning"></i>
            </div>
            <span class="text-secondary">{{ cliente.telefono }}</span>
          </div>
          <div class="small d-flex align-items-center">
            <div class="icon-circle-small me-2">
              <i class="bi bi-geo-alt-fill text-warning"></i>
            </div>
            <span class="text-secondary text-truncate">{{ cliente.direccion }}</span>
          </div>
        </div>
      </div>
    </div>

    <ModalForm
      modalId="clienteModal"
      :title="editing ? 'Modificar Cliente' : 'Nuevo Cliente'"
      :editing="editing"
      @submit="saveCliente"
    >
      <div class="row g-3">
        <div class="col-12 col-md-6">
          <label class="form-label fw-bold small text-muted">CÉDULA</label>
          <input v-model="currentCliente.id_cliente" type="text" class="form-control form-control-lg border-2 shadow-none" :readonly="editing" placeholder="V-000000">
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label fw-bold small text-muted">TELÉFONO</label>
          <input v-model="currentCliente.telefono" type="text" class="form-control form-control-lg border-2 shadow-none" placeholder="04xx-0000000">
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label fw-bold small text-muted">NOMBRE</label>
          <input v-model="currentCliente.nombre" type="text" class="form-control form-control-lg border-2 shadow-none">
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label fw-bold small text-muted">APELLIDO</label>
          <input v-model="currentCliente.apellido" type="text" class="form-control form-control-lg border-2 shadow-none">
        </div>
        <div class="col-12">
          <label class="form-label fw-bold small text-muted">DIRECCIÓN</label>
          <textarea v-model="currentCliente.direccion" class="form-control border-2 shadow-none" rows="3"></textarea>
        </div>
      </div>
    </ModalForm>
  </div>
</template>

<script setup>
import { useClientes } from '../composables/useClientes'
import DataTable from '../common/DataTable.vue'
import ModalForm from '../common/ModalForm.vue'

const { 
  clientes, currentCliente, editing, 
  openCreateModal, openEditModal, saveCliente, confirmDelete 
} = useClientes()

const columns = [
  { key: 'id_cliente', label: 'ID', class: 'fw-bold' },
  { key: 'nombre', label: 'CLIENTE', format: (row) => `${row.nombre} ${row.apellido}` },
  { key: 'telefono', label: 'TELÉFONO' },
  { key: 'direccion', label: 'UBICACIÓN', truncate: true }
]

defineExpose({ openCreateModal })
</script>

