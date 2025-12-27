<template>
  <div>
    <DataTable
      title="Gestión de Pedidos"
      :columns="columns"
      :data="pedidos"
      primaryKey="id_pedido"
      @create="openCreateModal"
      @edit="openEditModal"
      @delete="confirmDelete"
    />

    <ModalForm
      modalId="pedidoModal"
      :title="editing ? 'Editar Pedido' : 'Nuevo Pedido'"
      :editing="editing"
      @submit="savePedido"
    >
      <div class="mb-3">
        <label class="form-label">Cliente</label>
        <select v-model="currentPedido.cliente_fk" class="form-select">
          <option value="">Seleccionar cliente</option>
          <option v-for="cliente in clientes" :key="cliente.id_cliente" :value="cliente.id_cliente">
            {{ cliente.nombre }} {{ cliente.apellido }}
          </option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Hora de Entrega</label>
        <input v-model="currentPedido.hora_entrega" type="datetime-local" class="form-control">
      </div>
    </ModalForm>
  </div>
</template>

<script>
import DataTable from '../common/DataTable.vue'
import ModalForm from '../common/ModalForm.vue'


export default {
  name: 'PedidosCrud',
  components: { DataTable, ModalForm },
  data() {
    return {
      columns: [
        { key: 'id_pedido', label: 'ID' },
        { key: 'hora_entrega', label: 'Hora Entrega' },
        { key: 'cliente.nombre', label: 'Cliente' },
        { key: 'cliente.telefono', label: 'Teléfono' },
        { key: 'combos.length', label: '# Combos' }
      ],
      pedidos: [
        {
          "id_pedido": 1,
          "hora_entrega": "2000-01-01T14:30:00.000Z",
          "cliente_fk": "31400974",
          "cliente": {
            "id_cliente": "31400974",
            "nombre": "Juan",
            "apellido": "Pérez",
            "telefono": "0412-1234567",
            "direccion": "Av. Principal #123"
          },
          "combos": [
            {
              "id_combo": 1,
              "cantidad_empanadas": 10,
              "tipo_combo_fk": 1,
              "pedido_fk": 1
            }
          ]
        }
      ],
      clientes: [
        {
          "id_cliente": "31400974",
          "nombre": "Juan",
          "apellido": "Pérez",
          "telefono": "0412-1234567",
          "direccion": "Av. Principal #123"
        }
      ],
      currentPedido: this.getEmptyPedido(),
      editing: false
    }
  },
  methods: {
    getEmptyPedido() {
      return {
        id_pedido: null,
        hora_entrega: '',
        cliente_fk: '',
        combos: []
      }
    },
    openCreateModal() {
      this.currentPedido = this.getEmptyPedido()
      this.editing = false
      new bootstrap.Modal(document.getElementById('pedidoModal')).show()
    },
    openEditModal(pedido) {
      this.currentPedido = { ...pedido }
      this.editing = true
      new bootstrap.Modal(document.getElementById('pedidoModal')).show()
    },
    savePedido() {
      const cliente = this.clientes.find(c => c.id_cliente === this.currentPedido.cliente_fk)
      this.currentPedido.cliente = cliente
      
      if (this.editing) {
        const index = this.pedidos.findIndex(p => p.id_pedido === this.currentPedido.id_pedido)
        this.pedidos.splice(index, 1, this.currentPedido)
      } else {
        this.currentPedido.id_pedido = this.pedidos.length + 1
        this.pedidos.push(this.currentPedido)
      }
    },
    confirmDelete(pedido) {
      if (confirm(`¿Eliminar pedido #${pedido.id_pedido}?`)) {
        this.pedidos = this.pedidos.filter(p => p.id_pedido !== pedido.id_pedido)
      }
    }
  }
}
</script>