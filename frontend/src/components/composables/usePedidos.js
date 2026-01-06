import { ref, onMounted } from 'vue'
import { empanadasService } from '../../api/empanadasApi'
import { alerts } from '@/utils/alerts'
import * as bootstrap from 'bootstrap'

export function usePedidos() {
  const pedidos = ref([])
  const clientes = ref([])
  const isLoading = ref(false)
  const editing = ref(false)
  const currentPedido = ref({ hora_entrega: '', cliente_fk: '', estado: 'Pendiente' })
  const selectedPedido = ref(null)

  let modalInstance = null
  let detailsModalInstance = null

  const fetchData = async () => {
    isLoading.value = true
    try {
      const [resP, resC] = await Promise.all([
        empanadasService.getPedidos(),
        empanadasService.getClientes()
      ])
      pedidos.value = resP
      clientes.value = resC
    } finally {
      isLoading.value = false
    }
  }

  const openCreateModal = () => {
    editing.value = false
    currentPedido.value = { hora_entrega: '', cliente_fk: '', estado: 'Pendiente' }
    modalInstance?.show()
  }

  const openEditModal = (p) => {
    editing.value = true
    currentPedido.value = { ...p }
    modalInstance?.show()
  }


const openDetailsModal = async (id) => {
  try {
    isLoading.value = true;
    // La respuesta ahora vendrá con: bandeja -> sabor -> nombre
    const data = await empanadasService.getPedidoById(id);
    selectedPedido.value = data;
    detailsModalInstance?.show();
  } catch (error) {
    alerts.error('Error', 'No se pudo obtener el detalle con sabores');
  } finally {
    isLoading.value = false;
  }
};

  const savePedido = async () => {
    try {
      if (editing.value) {
        await empanadasService.updatePedido(currentPedido.value.id_pedido, { pedido: currentPedido.value })
      } else {
        await empanadasService.createPedido({ pedido: currentPedido.value })
      }
      alerts.success('¡Listo!');
      fetchData()
      modalInstance?.hide()
    } catch (e) { alerts.error('Error al guardar') }
  }

  const confirmDelete = async (id) => {
    if (await alerts.confirm('¿Eliminar?', 'Se borrará el pedido permanentemente')) {
      try {
        await empanadasService.deletePedido(id)
        fetchData()
      } catch (e) { alerts.error('Error') }
    }
  }

  onMounted(() => {
    fetchData()
    modalInstance = new bootstrap.Modal(document.getElementById('pedidoModal'))
    detailsModalInstance = new bootstrap.Modal(document.getElementById('detailsPedidoModal'))
  })

  return {
    pedidos, clientes, isLoading, editing, currentPedido, selectedPedido,
    openCreateModal, openEditModal, openDetailsModal, savePedido, confirmDelete
  }
}