<template>
  <div>
    <DataTable
      title="Gestión de Sabores"
      :columns="columns"
      :data="sabores"
      primaryKey="id_sabor"
      @create="openCreateModal"
      @edit="openEditModal"
      @delete="confirmDelete"
    />

    <ModalForm
      modalId="saborModal"
      :title="editing ? 'Editar Sabor' : 'Nuevo Sabor'"
      :editing="editing"
      @submit="saveSabor"
    >
      <div class="mb-3">
        <label class="form-label">Nombre del Sabor</label>
        <input v-model="currentSabor.nombre" type="text" class="form-control">
      </div>
    </ModalForm>
  </div>
</template>

<script>
import DataTable from '../common/DataTable.vue'
import ModalForm from '../common/ModalForm.vue'


export default {
  name: 'SaboresCrud',
  components: { DataTable, ModalForm },
  data() {
    return {
      columns: [
        { key: 'id_sabor', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'sabor_materias.length', label: '# Ingredientes' }
      ],
      sabores: [
        {
          "id_sabor": 1,
          "nombre": "Queso",
          "sabor_materias": [
            {
              "id_sabor_materia": 1,
              "sabor_fk": 1,
              "materia_prima_fk": 1
            },
            {
              "id_sabor_materia": 2,
              "sabor_fk": 1,
              "materia_prima_fk": 4
            }
          ]
        },
        {
          "id_sabor": 2,
          "nombre": "Carne",
          "sabor_materias": []
        }
      ],
      currentSabor: this.getEmptySabor(),
      editing: false
    }
  },
  methods: {
    getEmptySabor() {
      return {
        id_sabor: null,
        nombre: '',
        sabor_materias: []
      }
    },
    openCreateModal() {
      this.currentSabor = this.getEmptySabor()
      this.editing = false
      new bootstrap.Modal(document.getElementById('saborModal')).show()
    },
    openEditModal(sabor) {
      this.currentSabor = { ...sabor }
      this.editing = true
      new bootstrap.Modal(document.getElementById('saborModal')).show()
    },
    saveSabor() {
      if (this.editing) {
        const index = this.sabores.findIndex(s => s.id_sabor === this.currentSabor.id_sabor)
        this.sabores.splice(index, 1, this.currentSabor)
      } else {
        this.currentSabor.id_sabor = this.sabores.length + 1
        this.sabores.push(this.currentSabor)
      }
    },
    confirmDelete(sabor) {
      if (confirm(`¿Eliminar sabor "${sabor.nombre}"?`)) {
        this.sabores = this.sabores.filter(s => s.id_sabor !== sabor.id_sabor)
      }
    }
  }
}
</script>