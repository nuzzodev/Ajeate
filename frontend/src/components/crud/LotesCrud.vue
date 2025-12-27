<template>
  <div>
    <DataTable
      title="Gestión de Lotes"
      :columns="columns"
      :data="lotes"
      primaryKey="id_lote"
      @create="openCreateModal"
      @edit="openEditModal"
      @delete="confirmDelete"
    />

    <ModalForm
      modalId="loteModal"
      :title="editing ? 'Editar Lote' : 'Nuevo Lote'"
      :editing="editing"
      @submit="saveLote"
    >
      <div class="mb-3">
        <label class="form-label">Cantidad del Lote</label>
        <input v-model="currentLote.cantidad_lote" type="number" class="form-control" min="1">
      </div>
      <div class="mb-3">
        <label class="form-label">Sabores</label>
        <div v-for="sabor in sabores" :key="sabor.id_sabor" class="form-check">
          <input 
            class="form-check-input" 
            type="checkbox" 
            :value="sabor.id_sabor"
            v-model="currentLote.selectedSabores"
            :id="'sabor_' + sabor.id_sabor">
          <label class="form-check-label" :for="'sabor_' + sabor.id_sabor">
            {{ sabor.nombre }}
          </label>
        </div>
      </div>
    </ModalForm>
  </div>
</template>

<script>
import DataTable from '../common/DataTable.vue'
import ModalForm from '../common/ModalForm.vue'


export default {
  name: 'LotesCrud',
  components: { DataTable, ModalForm },
  data() {
    return {
      columns: [
        { key: 'id_lote', label: 'ID' },
        { key: 'cantidad_lote', label: 'Cantidad' },
        { key: 'sabor_lotes.length', label: '# Sabores' },
        { key: 'sabor_lotes', label: 'Sabores' }
      ],
      lotes: [
        {
          "id_lote": 1,
          "cantidad_lote": 50,
          "sabor_lotes": [
            {
              "id_sabor_lote": 1,
              "lote_fk": 1,
              "sabor_fk": 5
            },
            {
              "id_sabor_lote": 6,
              "lote_fk": 1,
              "sabor_fk": 5
            }
          ]
        }
      ],
      sabores: [
        { "id_sabor": 1, "nombre": "Queso" },
        { "id_sabor": 2, "nombre": "Carne" },
        { "id_sabor": 5, "nombre": "Pollo" }
      ],
      currentLote: this.getEmptyLote(),
      editing: false
    }
  },
  methods: {
    getEmptyLote() {
      return {
        id_lote: null,
        cantidad_lote: 0,
        selectedSabores: [],
        sabor_lotes: []
      }
    },
    openCreateModal() {
      this.currentLote = this.getEmptyLote()
      this.editing = false
      new bootstrap.Modal(document.getElementById('loteModal')).show()
    },
    openEditModal(lote) {
      this.currentLote = { 
        ...lote,
        selectedSabores: lote.sabor_lotes.map(sl => sl.sabor_fk)
      }
      this.editing = true
      new bootstrap.Modal(document.getElementById('loteModal')).show()
    },
    saveLote() {
      this.currentLote.sabor_lotes = this.currentLote.selectedSabores.map(sabor_fk => ({
        id_sabor_lote: Date.now() + Math.random(),
        lote_fk: this.currentLote.id_lote,
        sabor_fk
      }))
      
      if (this.editing) {
        const index = this.lotes.findIndex(l => l.id_lote === this.currentLote.id_lote)
        this.lotes.splice(index, 1, this.currentLote)
      } else {
        this.currentLote.id_lote = this.lotes.length + 1
        this.lotes.push(this.currentLote)
      }
    },
    confirmDelete(lote) {
      if (confirm(`¿Eliminar lote #${lote.id_lote}?`)) {
        this.lotes = this.lotes.filter(l => l.id_lote !== lote.id_lote)
      }
    }
  }
}
</script>