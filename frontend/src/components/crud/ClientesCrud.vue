<template>
  <div class="">
    <DataTable
      title="Gestión de Clientes"
      :columns="columns"
      :data="clientes"
      primaryKey="id_cliente"
      @create="openCreateModal"
      @edit="openEditModal"
      @delete="confirmDelete"
    />

    <ModalForm
      modalId="clienteModal"
      :title="editing ? 'Editar Cliente' : 'Nuevo Cliente'"
      :editing="editing"
      @submit="saveCliente"
    >
      <div class="mb-3">
        <label class="form-label">Cédula</label>
        <input v-model="currentCliente.id_cliente" type="text" class="form-control" :readonly="editing">
      </div>
      <div class="mb-3">
        <label class="form-label">Nombre</label>
        <input v-model="currentCliente.nombre" type="text" class="form-control">
      </div>
      <div class="mb-3">
        <label class="form-label">Apellido</label>
        <input v-model="currentCliente.apellido" type="text" class="form-control">
      </div>
      <div class="mb-3">
        <label class="form-label">Teléfono</label>
        <input v-model="currentCliente.telefono" type="text" class="form-control">
      </div>
      <div class="mb-3">
        <label class="form-label">Dirección</label>
        <textarea v-model="currentCliente.direccion" class="form-control" rows="2"></textarea>
      </div>
    </ModalForm>
  </div>
</template>

<script>
import DataTable from '../common/DataTable.vue'
import ModalForm from '../common/ModalForm.vue'


export default {
  name: 'ClientesCrud',
  components: { DataTable, ModalForm },
  data() {
    return {
      columns: [
        { key: 'id_cliente', label: 'Cédula' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'apellido', label: 'Apellido' },
        { key: 'telefono', label: 'Teléfono' },
        { key: 'direccion', label: 'Dirección' }
      ],
      clientes: [
        {
          "id_cliente": "31400974",
          "nombre": "Juan",
          "apellido": "Pérez",
          "telefono": "0412-1234567",
          "direccion": "Av. Principal #123"
        },
        {
          "id_cliente": "25478963",
          "nombre": "María",
          "apellido": "González",
          "telefono": "0414-9876543",
          "direccion": "Calle 5 #45-67"
        }
      ],
      currentCliente: this.getEmptyCliente(),
      editing: false
    }
  },
  methods: {
    getEmptyCliente() {
      return {
        id_cliente: '',
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: ''
      }
    },
    openCreateModal() {
      this.currentCliente = this.getEmptyCliente()
      this.editing = false
      new bootstrap.Modal(document.getElementById('clienteModal')).show()
    },
    openEditModal(cliente) {
      this.currentCliente = { ...cliente }
      this.editing = true
      new bootstrap.Modal(document.getElementById('clienteModal')).show()
    },
    saveCliente() {
      if (this.editing) {
        const index = this.clientes.findIndex(c => c.id_cliente === this.currentCliente.id_cliente)
        this.clientes.splice(index, 1, this.currentCliente)
      } else {
        this.clientes.push(this.currentCliente)
      }
    },
    confirmDelete(cliente) {
      if (confirm(`¿Eliminar cliente ${cliente.nombre} ${cliente.apellido}?`)) {
        this.clientes = this.clientes.filter(c => c.id_cliente !== cliente.id_cliente)
      }
    }
  }
}
</script>