import { ref, onMounted } from 'vue'
import * as bootstrap from 'bootstrap'
import { empanadasService } from '@/api/empanadasApi'
import { alerts } from '@/utils/alerts'

export function useMateriasPrimas() {
  const materias = ref([])
  const currentMateria = ref({ nombre: '', cantidad: 0, marca: '' })
  const editing = ref(false)
  const isLoading = ref(false)
  let modalInstance = null

  const fetchMaterias = async () => {
    isLoading.value = true
    try {
      const data = await empanadasService.getMateriasPrimas()
      materias.value = data
    } catch (error) {
      alerts.error('Error', 'No se pudieron cargar las materias primas')
    } finally {
      isLoading.value = false
    }
  }

  const saveMateria = async () => {
    try {
      if (editing.value) {
        await empanadasService.updateMateriaPrima(currentMateria.value.id_materia_prima, currentMateria.value)
        alerts.success('¡Insumo actualizado!')
      } else {
        await empanadasService.createMateriaPrima(currentMateria.value)
        alerts.success('¡Insumo registrado!')
      }
      await fetchMaterias()
      modalInstance.hide()
    } catch (error) {
      alerts.error('Error', 'No se pudo procesar la solicitud')
    }
  }

  const confirmDelete = async (materia) => {
    const result = await alerts.confirm(
      '¿Eliminar insumo?',
      `Vas a eliminar ${materia.nombre}. Esto afectará el inventario.`
    )
    if (result.isConfirmed) {
      try {
        await empanadasService.deleteMateriaPrima(materia.id_materia_prima)
        materias.value = materias.value.filter(m => m.id_materia_prima !== materia.id_materia_prima)
        alerts.success('Eliminado con éxito')
      } catch (error) {
        alerts.error('Error', 'No se pudo eliminar el registro')
      }
    }
  }

  onMounted(() => {
    const modalEl = document.getElementById('materiaModal')
    if (modalEl) modalInstance = new bootstrap.Modal(modalEl)
    fetchMaterias()
  })

  const openCreateModal = () => {
    editing.value = false
    currentMateria.value = { nombre: '', cantidad: 0, marca: '' }
    modalInstance.show()
  }

  const openEditModal = (materia) => {
    editing.value = true
    currentMateria.value = { ...materia }
    modalInstance.show()
  }

  return {
    materias, currentMateria, editing, isLoading,
    openCreateModal, openEditModal, saveMateria, confirmDelete
  }
}