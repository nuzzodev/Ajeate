<template>
  <div>
    <DataTable
      title="Gestión de Combos"
      :columns="columns"
      :data="combos"
      primaryKey="id_combo"
      @create="openCreateModal"
      @edit="openEditModal"
      @delete="confirmDelete"
    />

    <ModalForm
      modalId="comboModal"
      :title="editing ? 'Editar Combo' : 'Nuevo Combo'"
      :editing="editing"
      @submit="saveCombo"
    >
      <div class="mb-3">
        <label class="form-label">Pedido</label>
        <select v-model="currentCombo.pedido_fk" class="form-select">
          <option value="">Seleccionar pedido</option>
          <option v-for="pedido in pedidos" :key="pedido.id_pedido" :value="pedido.id_pedido">
            Pedido #{{ pedido.id_pedido }} - {{ pedido.cliente.nombre }}
          </option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Tipo de Combo</label>
        <select v-model="currentCombo.tipo_combo_fk" class="form-select">
          <option value="">Seleccionar tipo</option>
          <option v-for="tipo in tiposCombo" :key="tipo.id_tipocombo" :value="tipo.id_tipocombo">
            {{ tipo.nombre }}
          </option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Cantidad de Empanadas</label>
        <input v-model="currentCombo.cantidad_empanadas" type="number" class="form-control" min="1">
      </div>
    </ModalForm>
  </div>
</template>

<script>
import DataTable from '../common/DataTable.vue'
import ModalForm from '../common/ModalForm.vue'


export default {
  name: 'CombosCrud',
  components: { DataTable, ModalForm },
  data() {
    return {
      columns: [
        { key: 'id_combo', label: 'ID' },
        { key: 'cantidad_empanadas', label: 'Cantidad' },
        { key: 'tipo_combo.nombre', label: 'Tipo' },
        { key: 'pedido.id_pedido', label: 'Pedido #' },
        { key: 'combo_detalles.length', label: '# Detalles' }
      ],
      combos: [
        {
          "id_combo": 1,
          "cantidad_empanadas": 10,
          "tipo_combo_fk": 1,
          "pedido_fk": 1,
          "pedido": {
            "id_pedido": 1,
            "hora_entrega": "2000-01-01T14:30:00.000Z",
            "cliente_fk": "31400974"
          },
          "tipo_combo": {
            "id_tipocombo": 1,
            "nombre": "Un Sabor"
          },
          "combo_detalles": [
            {
              "id_combo_detalle": 1,
              "cantidad_por_sabor": 10,
              "bandeja_fk": 3,
              "combo_fk": 1
            }
          ]
        }
      ],
      pedidos: [
        {
          "id_pedido": 1,
          "hora_entrega": "2000-01-01T14:30:00.000Z",
          "cliente_fk": "31400974",
          "cliente": { "nombre": "Juan" }
        }
      ],
      tiposCombo: [
        { "id_tipocombo": 1, "nombre": "Un Sabor" },
        { "id_tipocombo": 2, "nombre": "Dos Sabores" },
        { "id_tipocombo": 3, "nombre": "Tres Sabores" }
      ],
      currentCombo: this.getEmptyCombo(),
      editing: false
    }
  },
  methods: {
    getEmptyCombo() {
      return {
        id_combo: null,
        cantidad_empanadas: 0,
        tipo_combo_fk: '',
        pedido_fk: '',
        combo_detalles: []
      }
    },
    openCreateModal() {
      this.currentCombo = this.getEmptyCombo()
      this.editing = false
      new bootstrap.Modal(document.getElementById('comboModal')).show()
    },
    openEditModal(combo) {
      this.currentCombo = { ...combo }
      this.editing = true
      new bootstrap.Modal(document.getElementById('comboModal')).show()
    },
    saveCombo() {
      const pedido = this.pedidos.find(p => p.id_pedido === this.currentCombo.pedido_fk)
      const tipo = this.tiposCombo.find(t => t.id_tipocombo === this.currentCombo.tipo_combo_fk)
      
      this.currentCombo.pedido = pedido
      this.currentCombo.tipo_combo = tipo
      
      if (this.editing) {
        const index = this.combos.findIndex(c => c.id_combo === this.currentCombo.id_combo)
        this.combos.splice(index, 1, this.currentCombo)
      } else {
        this.currentCombo.id_combo = this.combos.length + 1
        this.combos.push(this.currentCombo)
      }
    },
    confirmDelete(combo) {
      if (confirm(`¿Eliminar combo #${combo.id_combo}?`)) {
        this.combos = this.combos.filter(c => c.id_combo !== combo.id_combo)
      }
    }
  }
}
</script>