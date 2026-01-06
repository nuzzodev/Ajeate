import { ref, onMounted } from 'vue'
import * as bootstrap from 'bootstrap'
import { empanadasService } from '../../api/empanadasApi' 
// IMPORTANTE: Debes importar tus alertas predeterminadas aquí
import { alerts } from '../../utils/alerts' 

export function useClientes() {
  const clientes = ref([])
  const currentCliente = ref({ id_cliente: '', nombre: '', apellido: '', telefono: '', direccion: '' })
  const editing = ref(false)
  const isLoading = ref(false) 
  
  let modalInstance = null

  const fetchClientes = async () => {
    isLoading.value = true
    try {
      const data = await empanadasService.getClientes()
      clientes.value = data
    } catch (error) {
      console.error("Error al cargar clientes:", error)
      alerts.error('Error de conexión', 'No se pudo obtener la lista de clientes');
    } finally {
      isLoading.value = false
    }
  }

  const saveCliente = async () => {
    try {
      if (editing.value) {
        await empanadasService.updateCliente(currentCliente.value.id_cliente, currentCliente.value);
        alerts.success('¡Cliente actualizado!'); 
      } else {
        await empanadasService.createCliente(currentCliente.value);
        alerts.success('¡Cliente registrado!');
      }
      await fetchClientes();
      modalInstance.hide();
    } catch (error) {
      console.error(error);
      alerts.error('Error al guardar', 'Verifica los datos e intenta de nuevo');
    }
  };

  const confirmDelete = async (cliente) => {
    const result = await alerts.confirm(
      '¿Eliminar cliente?',
      `Estás a punto de borrar a ${cliente.nombre}. Esta acción no se puede deshacer.`
    );

    if (result.isConfirmed) {
      try {
        await empanadasService.deleteCliente(cliente.id_cliente);
        clientes.value = clientes.value.filter(c => c.id_cliente !== cliente.id_cliente);
        alerts.success('Cliente eliminado correctamente');
      } catch (error) {
        alerts.error('Error', 'No se pudo eliminar el registro');
      }
    }
  };

  onMounted(() => {
    const modalEl = document.getElementById('clienteModal')
    if (modalEl) modalInstance = new bootstrap.Modal(modalEl)
    fetchClientes()
  })

  const openCreateModal = () => {
    editing.value = false
    currentCliente.value = { id_cliente: '', nombre: '', apellido: '', telefono: '', direccion: '' }
    modalInstance.show()
  }

  const openEditModal = (cliente) => {
    editing.value = true
    currentCliente.value = { ...cliente }
    modalInstance.show()
  }

  return {
    clientes,
    currentCliente,
    editing,
    isLoading,
    openCreateModal,
    openEditModal,
    saveCliente,
    confirmDelete,
    fetchClientes
  }
}