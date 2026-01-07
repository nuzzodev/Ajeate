import { ref, onMounted } from 'vue'
import * as bootstrap from 'bootstrap'
import { empanadasService } from '../../api/empanadasApi'
import { alerts } from '@/utils/alerts'

export function usePedidos() {
  // --- ESTADO ---
  const pedidos = ref([])
  const clientes = ref([])
  const isLoading = ref(false)
  const editing = ref(false)
  
  const currentPedido = ref({
    cliente_fk: '',
    hora_entrega: ''
  })
  
  const selectedPedido = ref(null)

  // Instancias de Bootstrap
  let modalInstance = null
  let detailsModalInstance = null

  // --- FUNCIONES UTILITARIAS ---
  const convertLocalToUTC = (localDateTime) => {
    // Convierte una fecha/hora local a UTC
    if (!localDateTime) return null
    
    const localDate = new Date(localDateTime)
    const utcString = localDate.toISOString() // Esto devuelve formato ISO con UTC
    return utcString
  }

  const convertUTCToLocal = (utcDateTime) => {
    // Convierte UTC a formato datetime-local para mostrar en el input
    if (!utcDateTime) return ''
    
    const date = new Date(utcDateTime)
    // Obtiene la fecha en formato YYYY-MM-DDTHH:MM ajustada a la zona horaria local
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  // --- CARGA DE DATOS ---
  const fetchData = async () => {
    isLoading.value = true
    try {
      pedidos.value = await empanadasService.getPedidos()
      clientes.value = await empanadasService.getClientes()
    } catch (error) {
      alerts.error('Error', 'No se pudo cargar la información')
    } finally {
      isLoading.value = false
    }
  }

  // --- CICLO DE VIDA ---
  onMounted(() => {
    const modalEl = document.getElementById('pedidoModal')
    if (modalEl) modalInstance = new bootstrap.Modal(modalEl)
    
    const detailsEl = document.getElementById('detailsPedidoModal')
    if (detailsEl) detailsModalInstance = new bootstrap.Modal(detailsEl)
    
    fetchData()
  })

  // --- ACCIONES ---
  const openCreateModal = () => {
    editing.value = false
    currentPedido.value = {
      cliente_fk: '',
      // Inicializar con la hora actual en formato local para el input
      hora_entrega: new Date().toISOString().slice(0, 16)
    }
    modalInstance?.show()
  }

  const openEditModal = (pedido) => {
    editing.value = true
    currentPedido.value = {
      id_pedido: pedido.id_pedido,
      cliente_fk: pedido.cliente_fk,
      // Convertir UTC del backend a formato local para el input
      hora_entrega: pedido.hora_entrega ? 
        convertUTCToLocal(pedido.hora_entrega) :
        new Date().toISOString().slice(0, 16)
    }
    modalInstance?.show()
  }

  const openDetailsModal = async (id) => {
    try {
      const response = await empanadasService.getPedidoById(id)
      selectedPedido.value = response
      detailsModalInstance?.show()
    } catch (error) {
      alerts.error('Error', 'No se pudieron cargar los detalles del pedido')
    }
  }

  const savePedido = async () => {
    try {
      // CORRECCIÓN: Convertir la hora local a UTC antes de enviar
      const horaEntregaUTC = convertLocalToUTC(currentPedido.value.hora_entrega)
      
      // Solo enviar los campos que existen en el backend
      const pedidoData = {
        cliente_fk: currentPedido.value.cliente_fk,
        hora_entrega: horaEntregaUTC // Enviar en formato UTC
      }

      if (editing.value) {
        await empanadasService.updatePedido(currentPedido.value.id_pedido, {
          pedido: pedidoData
        })
        alerts.success('¡Pedido Actualizado!')
      } else {
        await empanadasService.createPedido({
          pedido: pedidoData
        })
        alerts.success('¡Pedido Creado!')
      }
      
      await fetchData()
      modalInstance?.hide()
    } catch (error) {
      console.error('Error al guardar pedido:', error)
      alerts.error('Error', 'No se pudo guardar el pedido')
    }
  }

  const confirmDelete = async (pedido) => {
    if (confirm(`¿Estás seguro de eliminar el pedido #${pedido.id_pedido}?`)) {
      try {
        await empanadasService.deletePedido(pedido.id_pedido)
        alerts.success('¡Pedido Eliminado!')
        await fetchData()
      } catch (error) {
        alerts.error('Error', 'No se pudo eliminar el pedido')
      }
    }
  }

  return {
    pedidos,
    clientes,
    isLoading,
    editing,
    currentPedido,
    selectedPedido,
    openCreateModal,
    openEditModal,
    openDetailsModal,
    savePedido,
    confirmDelete,
    fetchData
  }
}