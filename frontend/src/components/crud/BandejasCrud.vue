<template>
  <div>
    <DataTable
      title="Gestión de Bandejas"
      :columns="columns"
      :data="bandejas"
      primaryKey="id_bandeja"
      @create="openCreateModal"
      @edit="openEditModal"
      @delete="confirmDelete"
    />

    <ModalForm
      modalId="bandejaModal"
      :title="editing ? 'Editar Bandeja' : 'Nuevo Bandeja'"
      :editing="editing"
      @submit="saveBandeja"
    >
      <div class="mb-3">
        <label class="form-label">Fecha de Producción</label>
        <input v-model="currentBandeja.fecha_produccion" type="date" class="form-control">
      </div>
      <div class="mb-3">
        <label class="form-label">Cantidad Disponible</label>
        <input v-model="currentBandeja.cantidad_disponible" type="number" class="form-control" min="0">
      </div>
      <div class="mb-3">
        <label class="form-label">Sabor</label>
        <select v-model="currentBandeja.sabor_fk" class="form-select">
          <option value="">Seleccionar sabor</option>
          <option v-for="sabor in sabores" :key="sabor.id_sabor" :value="sabor.id_sabor">
            {{ sabor.nombre }}
          </option>
        </select>
      </div>
    </ModalForm>
  </div>
</template>

<script>
import * as bootstrap from 'bootstrap'
import DataTable from '../common/DataTable.vue'
import ModalForm from '../common/ModalForm.vue'

export default {
  name: 'BandejasCrud',
  components: { DataTable, ModalForm },
  data() {
    return {
      columns: [
        { key: 'id_bandeja', label: 'ID' },
        { key: 'fecha_produccion', label: 'Fecha Producción' },
        { key: 'cantidad_disponible', label: 'Cantidad' },
        { key: 'sabor.nombre', label: 'Sabor' }
      ],
      bandejas: [
        {
          "id_bandeja": 4,
          "fecha_produccion": "2024-12-14",
          "cantidad_disponible": 180,
          "sabor_fk": 1,
          "sabor": {
            "id_sabor": 1,
            "nombre": "Queso"
          }
        }
      ],
      sabores: [
        { "id_sabor": 1, "nombre": "Queso" },
        { "id_sabor": 2, "nombre": "Carne" }
      ],
      currentBandeja: this.getEmptyBandeja(),
      editing: false
    }
  },
  methods: {
    getEmptyBandeja() {
      return {
        id_bandeja: null,
        fecha_produccion: '',
        cantidad_disponible: 0,
        sabor_fk: ''
      }
    },
    openCreateModal() {
      this.currentBandeja = this.getEmptyBandeja()
      this.editing = false
      new bootstrap.Modal(document.getElementById('bandejaModal')).show()
    },
    openEditModal(bandeja) {
      this.currentBandeja = { ...bandeja }
      this.editing = true
      new bootstrap.Modal(document.getElementById('bandejaModal')).show()
    },
    saveBandeja() {
      const sabor = this.sabores.find(s => s.id_sabor === this.currentBandeja.sabor_fk)
      this.currentBandeja.sabor = sabor
      
      if (this.editing) {
        const index = this.bandejas.findIndex(b => b.id_bandeja === this.currentBandeja.id_bandeja)
        this.bandejas.splice(index, 1, this.currentBandeja)
      } else {
        this.currentBandeja.id_bandeja = this.bandejas.length + 1
        this.bandejas.push(this.currentBandeja)
      }
    },
    confirmDelete(bandeja) {
      if (confirm(`¿Eliminar bandeja #${bandeja.id_bandeja}?`)) {
        this.bandejas = this.bandejas.filter(b => b.id_bandeja !== bandeja.id_bandeja)
      }
    }
  }
}
</script>