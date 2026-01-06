import { ref, onMounted } from 'vue'
import * as bootstrap from 'bootstrap'
import { empanadasService } from '@/api/empanadasApi'
import { alerts } from '@/utils/alerts'

export function useLotes() {
  const lotes = ref([])
  const sabores = ref([])
  const currentLote = ref({ cantidad_lote: 50, sabores_seleccionados: [] })
  const editing = ref(false)
  const selectedLote = ref(null)
  let detailsModal = null
  const isLoading = ref(false)
  let modalInstance = null

  const fetchData = async () => {
    isLoading.value = true
    try {
      const [dataLotes, dataSabores] = await Promise.all([
        empanadasService.getLotes(),
        empanadasService.getSabores()
      ])
      lotes.value = dataLotes
      sabores.value = dataSabores
    } catch (error) {
      alerts.error('Error', 'No se pudo obtener la información')
    } finally {
      isLoading.value = false
    }
  }

  const saveLote = async () => {
    try {
      // --- TRANSFORMACIÓN DE DATOS PARA RAILS ---
      const payload = {
        lote: {
          cantidad_lote: currentLote.value.cantidad_lote,
          // Convertimos el array de IDs simple a la estructura que espera Rails
          sabor_lotes_attributes: currentLote.value.sabores_seleccionados.map(saborId => ({
            sabor_fk: saborId
          }))
        }
      }

      if (editing.value) {
        // Para el UPDATE, Rails necesita el ID del lote
        await empanadasService.updateLote(currentLote.value.id_lote, payload)
        alerts.success('¡Lote actualizado!')
      } else {
        await empanadasService.createLote(payload)
        alerts.success('¡Lote creado con éxito!')
      }
      
      await fetchData()
      modalInstance.hide()
    } catch (error) {
      console.error(error)
      alerts.error('Error', 'No se pudo procesar la solicitud')
    }
  }

  const confirmDelete = async (lote) => {
    const result = await alerts.confirm('¿Eliminar Lote?', `ID: ${lote.id_lote}`)
    if (result.isConfirmed) {
      try {
        await empanadasService.deleteLote(lote.id_lote)
        await fetchData() // Recargamos para asegurar sincronía
        alerts.success('Lote eliminado')
      } catch (error) {
        alerts.error('Error', 'No se pudo eliminar')
      }
    }
  }

  onMounted(() => {
    const modalEl = document.getElementById('loteModal')
    if (modalEl) modalInstance = new bootstrap.Modal(modalEl)
    fetchData()
  })

  const openCreateModal = () => {
    editing.value = false
    currentLote.value = { cantidad_lote: 50, sabores_seleccionados: [] }
    modalInstance.show()
  }

  const openEditModal = (lote) => {
    editing.value = true
    // IMPORTANTE: Mapeamos los sabores que vienen de la DB al array de IDs del checkbox
    currentLote.value = { 
      ...lote,
      sabores_seleccionados: lote.sabor_lotes ? lote.sabor_lotes.map(s => s.sabor_fk) : []
    }
    modalInstance.show()
  }
  const openDetailsModal = (lote) => {
    selectedLote.value = lote
    if (!detailsModal) {
      detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'))
    }
    detailsModal.show()
  }

  // ¡IMPORTANTE! Asegúrate de que openDetailsModal y selectedLote estén aquí
  return {
    lotes, sabores, currentLote, editing,
    selectedLote, openDetailsModal, // <--- REVISA ESTO
    openCreateModal, openEditModal, saveLote, confirmDelete
  }

  return {
    lotes, sabores, currentLote, editing, isLoading,
    openCreateModal, openEditModal, saveLote, confirmDelete
  }
}