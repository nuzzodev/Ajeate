import { ref, onMounted } from 'vue'
import * as bootstrap from 'bootstrap'
import { empanadasService } from '@/api/empanadasApi'
import { apiEmpanadas } from '@/api/index'
import { alerts } from '@/utils/alerts'

export function useSabores() {
  const sabores = ref([])
  const materiasPrimas = ref([])
  const materiasAnexadas = ref([]) // Para el modal de detalles
  const currentSabor = ref({ 
    nombre: '', 
    cantidad: 10.0, 
    imagen_url: '/images/sabores/default.jpg',
    sabor_materias_attributes: []
  })
  const editing = ref(false)
  const isLoading = ref(false)
  const selectedSabor = ref(null) // Para el modal de detalles
  
  let modalInstance = null
  let detailsModalInstance = null

  // --- CARGA DE DATOS ---
  const fetchData = async () => {
    isLoading.value = true
    try {
      const [saboresData, materiasData] = await Promise.all([
        empanadasService.getSabores(),
        empanadasService.getMateriasPrimas()
      ])
      sabores.value = saboresData
      materiasPrimas.value = materiasData
      
      // Solo inicializar materias primas si estamos creando nuevo sabor
      if (!editing.value && currentSabor.value.id_sabor === undefined) {
        currentSabor.value.sabor_materias_attributes = materiasData.map(mp => ({
          materia_prima_fk: mp.id_materia_prima,
          cantidad_a_descontar: 0,
          materia_prima_nombre: mp.nombre
        }))
      }
    } catch (error) {
      console.error("Error al cargar datos:", error)
      alerts.error('Error', 'No se pudo conectar con el servidor')
    } finally {
      isLoading.value = false
    }
  }

  // --- CARGA DE MATERIAS PRIMAS ANEXADAS (PARA DETALLES) ---
  const fetchMateriasAnexadas = async (saborId) => {
    try {
      const data = await empanadasService.getMateriasPrimasAnexadasSabor(saborId)
      materiasAnexadas.value = data
    } catch (error) {
      console.error("Error al cargar materias anexadas:", error)
      materiasAnexadas.value = []
    }
  }

  // --- OPERACIONES ---
  const saveSabor = async () => {
    try {
      if (!currentSabor.value.nombre.trim()) {
        alerts.error('Error', 'El nombre del sabor es requerido')
        return
      }

      // FILTRADO: Solo enviamos las que el usuario marcó con el CHECK
      const materiasSeleccionadas = currentSabor.value.sabor_materias_attributes
        .filter(mp => mp.selected) 
        .map(mp => ({
          materia_prima_fk: mp.materia_prima_fk,
          // Si no puso cantidad, enviamos 0 por defecto
          cantidad_a_descontar: parseFloat(mp.cantidad_a_descontar) || 0 
        }))

      const datosParaEnviar = {
        sabor: {
          nombre: currentSabor.value.nombre.trim(),
          cantidad: parseFloat(currentSabor.value.cantidad),
          imagen_url: currentSabor.value.imagen_url,
          sabor_materias_attributes: materiasSeleccionadas
        }
      }

      if (editing.value) {
        await empanadasService.updateSabor(currentSabor.value.id_sabor, datosParaEnviar)
        alerts.success('¡Sabor actualizado!')
      } else {
        await empanadasService.createSabor(datosParaEnviar)
        alerts.success('¡Sabor creado!')
      }
      
      await fetchData()
      modalInstance.hide()
    } catch (error) {
      console.error('Error al guardar:', error)
      alerts.error('Error', 'No se pudo guardar. Verifique los datos o integridad de IDs.')
    }
  }

    const confirmDelete = async (sabor) => {
      const result = await alerts.confirm(
        '¿Eliminar sabor?',
        `Se eliminará "${sabor.nombre}" permanentemente. Esta acción afectará a todas las bandejas relacionadas.`
      )

      if (result.isConfirmed) {
        try {
          await empanadasService.deleteSabor(sabor.id_sabor)
          sabores.value = sabores.value.filter(s => s.id_sabor !== sabor.id_sabor)
          alerts.success('Sabor eliminado correctamente')
        } catch (error) {
          console.error('Error al eliminar sabor:', error)
          alerts.error('Error', 'No se pudo eliminar el sabor')
        }
      }
    }

  // --- MANEJO DE MATERIAS PRIMAS ---
  const actualizarCantidadMateria = (index, cantidad) => {
    currentSabor.value.sabor_materias_attributes[index].cantidad_a_descontar = parseFloat(cantidad) || 0
  }

  const getMateriaPrimaNombre = (materiaId) => {
    const materia = materiasPrimas.value.find(mp => mp.id_materia_prima === materiaId)
    return materia ? materia.nombre : 'Desconocida'
  }

  // --- MODAL DE DETALLES ---
  const openDetailsModal = async (sabor) => {
    selectedSabor.value = sabor
    await fetchMateriasAnexadas(sabor.id_sabor)
    detailsModalInstance.show()
  }

  const productionData = ref({
  cantidad_final: 0,
  ingredientes: []
})

const openProductionModal = async (sabor) => {
  selectedSabor.value = sabor
  try {
    // 1. Obtenemos los ingredientes que este sabor TIENE PERMITIDOS
    const data = await empanadasService.getSaborById(sabor.id_sabor)
    
    // 2. Preparamos el formulario del modal
    productionData.value = {
      cantidad_final: 0,
      ingredientes: data.sabor_materias.map(sm => ({
        materia_prima_id: sm.materia_prima_fk,
        nombre: sm.materia_prima?.nombre || 'Ingrediente',
        cantidad: 0 // Lo que el usuario va a gastar
      }))
    }
    
    const modalEl = document.getElementById('productionModal')
    const modalInstance = new bootstrap.Modal(modalEl)
    modalInstance.show()
  } catch (error) {
    alerts.error('Error', 'No se pudieron cargar los ingredientes asignados a este sabor')
  }
}

const submitProduction = async () => {
  if (productionData.value.cantidad_final <= 0) {
    alerts.error('Error', 'Debes ingresar una cantidad de sabor producida')
    return
  }

  try {
    // Estructura de JSON requerida por tu backend
    const payload = {
      cantidad_final: parseFloat(productionData.value.cantidad_final),
      ingredientes: productionData.value.ingredientes.map(ing => ({
        materia_prima_id: ing.materia_prima_id,
        cantidad: parseFloat(ing.cantidad) || 0
      }))
    }

    // Llamada a la ruta PUT /sabores/:id/preparar_sabor
    await empanadasService.prepararSabor(selectedSabor.value.id_sabor, payload)
    
    alerts.success('¡Producción Registrada!', 'Stock de materias primas descontado y stock de sabor aumentado.')
    
    // Cerrar modal
    const modalEl = document.getElementById('productionModal')
    const modalInstance = bootstrap.Modal.getInstance(modalEl)
    if (modalInstance) modalInstance.hide()
    
    await fetchData() // Refrescar la tabla
  } catch (error) {
    // Si el backend devuelve error (ej. stock insuficiente), se muestra aquí
    const msg = error.response?.data?.error || 'Error al procesar la producción'
    alerts.error('Inventario Insuficiente', msg)
  }
}

  // --- UTILIDADES ---
  const getImageUrl = (url) => {
    if (!url) return '/images/sabores/default.jpg'
    if (url.startsWith('http')) return url
    
    const baseUrl = apiEmpanadas.defaults.baseURL.replace(/\/$/, '')
    return `${baseUrl}${url}`
  }

  const getStockTextClass = (cantidad) => {
    const cant = parseFloat(cantidad)
    if (cant === 0) return 'text-danger'
    if (cant < 5) return 'text-warning'
    return 'text-success'
  }

  // --- INICIALIZACIÓN ---
  onMounted(() => {
    const modalEl = document.getElementById('saborModal')
    const detailsModalEl = document.getElementById('detailsSaborModal')
    
    if (modalEl) modalInstance = new bootstrap.Modal(modalEl)
    if (detailsModalEl) detailsModalInstance = new bootstrap.Modal(detailsModalEl)
    
    fetchData()
  })

  const openCreateModal = () => {
    editing.value = false
    currentSabor.value = { 
      nombre: '', 
      cantidad: 10.0, 
      imagen_url: '/images/sabores/default.jpg',
      sabor_materias_attributes: materiasPrimas.value.map(mp => ({
        materia_prima_fk: mp.id_materia_prima,
        cantidad_a_descontar: 0,
        materia_prima_nombre: mp.nombre,
        selected: false // <--- Estado para el checkbox
      }))
    }
    modalInstance.show()
  }
  const openEditModal = async (sabor) => {
    editing.value = true
    
    try {
      // Cargar sabor completo para edición
      const saborCompleto = await empanadasService.getSaborById(sabor.id_sabor)
      
      // Cargar materias primas anexadas para este sabor
      const materiasAnexadas = await empanadasService.getMateriasPrimasAnexadasSabor(sabor.id_sabor)
      
      // Crear array de materias primas con sus cantidades
      const materiasConCantidad = materiasPrimas.value.map(mp => {
        const materiaAnexada = materiasAnexadas.find(ma => ma.id_materia_prima === mp.id_materia_prima)
        return {
          materia_prima_fk: mp.id_materia_prima,
          cantidad_a_descontar: materiaAnexada ? parseFloat(materiaAnexada.cantidad_a_descontar) : 0,
          materia_prima_nombre: mp.nombre
        }
      })
      
      currentSabor.value = { 
        id_sabor: saborCompleto.id_sabor,
        nombre: saborCompleto.nombre,
        cantidad: parseFloat(saborCompleto.cantidad),
        imagen_url: saborCompleto.imagen_url || '/images/sabores/default.jpg',
        sabor_materias_attributes: materiasConCantidad
      }
      
      modalInstance.show()
    } catch (error) {
      console.error('Error al cargar sabor para edición:', error)
      alerts.error('Error', 'No se pudo cargar los datos del sabor')
    }
  }

  return {
    sabores, 
    materiasPrimas, 
    materiasAnexadas,
    currentSabor, 
    selectedSabor,
    editing, 
    isLoading,
    openCreateModal, 
    openEditModal, 
    openDetailsModal,
    saveSabor, 
    confirmDelete, 
    getImageUrl, 
    actualizarCantidadMateria, 
    getMateriaPrimaNombre,
    getStockTextClass,
    openProductionModal,
    submitProduction, 
    productionData
  }
}