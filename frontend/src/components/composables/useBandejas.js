import { ref, onMounted } from 'vue'
import * as bootstrap from 'bootstrap'
import { empanadasService } from '@/api/empanadasApi' 
import { apiEmpanadas } from '@/api/index' // <--- IMPORTANTE: Importar la instancia de Axios
import { alerts } from '@/utils/alerts'

export function useBandejas() {
  const bandejas = ref([])
  const sabores = ref([])
  const currentBandeja = ref({ sabor_fk: '', fecha_produccion: '', cantidad_disponible: 0 })
  const editing = ref(false)
  const isLoading = ref(false)
  
  let modalInstance = null

  // --- CARGA DE DATOS ---
  const fetchData = async () => {
    isLoading.value = true
    try {
      const [dataBandejas, dataSabores] = await Promise.all([
        empanadasService.getBandejas(),
        empanadasService.getSabores()
      ])
      bandejas.value = dataBandejas
      sabores.value = dataSabores
    } catch (error) {
      console.error("Error al cargar datos:", error)
      alerts.error('Error', 'No se pudo conectar con el servidor')
    } finally {
      isLoading.value = false
    }
  }

  // --- OPERACIONES ---
  const saveBandeja = async () => {
    try {
      if (editing.value) {
        await empanadasService.updateBandeja(currentBandeja.value.id_bandeja, currentBandeja.value)
        alerts.success('¡Producción actualizada!')
      } else {
        await empanadasService.createBandeja(currentBandeja.value)
        alerts.success('¡Producción registrada!')
      }
      await fetchData()
      modalInstance.hide()
    } catch (error) {
      alerts.error('Error', 'No se pudo guardar la bandeja')
    }
  }

  const confirmDelete = async (bandeja) => {
    const result = await alerts.confirm(
      '¿Eliminar bandeja?',
      `Se borrará la producción de ${bandeja.sabor?.nombre || 'este sabor'}`
    )

    if (result.isConfirmed) {
      try {
        await empanadasService.deleteBandeja(bandeja.id_bandeja)
        bandejas.value = bandejas.value.filter(b => b.id_bandeja !== bandeja.id_bandeja)
        alerts.success('Eliminado correctamente')
      } catch (error) {
        alerts.error('Error', 'No se pudo eliminar')
      }
    }
  }

  // --- UTILIDADES ---
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-VE')
  }

  // Función corregida para resolver la URL de la imagen
  const getImageUrl = (url) => {
    if (!url) return '/images/sabores/default.jpg'
    if (url.startsWith('http')) return url
    
    // Obtenemos la base URL definida en tu archivo de axios
    const baseUrl = apiEmpanadas.defaults.baseURL.replace(/\/$/, '')
    return `${baseUrl}${url}`
  }

  onMounted(() => {
    const modalEl = document.getElementById('bandejaModal')
    if (modalEl) modalInstance = new bootstrap.Modal(modalEl)
    fetchData()
  })

  const openCreateModal = () => {
    editing.value = false
    currentBandeja.value = { 
      fecha_produccion: new Date().toISOString().split('T')[0], 
      cantidad_disponible: 200, 
      sabor_fk: '' 
    }
    modalInstance.show()
  }

  const openEditModal = (bandeja) => {
    editing.value = true
    currentBandeja.value = { ...bandeja }
    modalInstance.show()
  }

  return {
    bandejas, sabores, currentBandeja, editing, isLoading,
    formatDate, openCreateModal, openEditModal, saveBandeja, confirmDelete, getImageUrl
  }
}