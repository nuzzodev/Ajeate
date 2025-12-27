import { computed } from 'vue'

export function useSaborCard(sabor) {
  const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
  const defaultImage = '/images/sabores/default.jpg'

  // Construir URL de la imagen
  const imagenUrl = computed(() => {
    if (!sabor.value.imagen) {
      return `${backendUrl}${defaultImage}`
    }
    
    // Si ya es una URL completa
    if (sabor.value.imagen.startsWith('http')) {
      return sabor.value.imagen
    }
    
    // Si es una ruta relativa
    return `${backendUrl}${sabor.value.imagen.startsWith('/') ? '' : '/'}${sabor.value.imagen}`
  })

  const handleImageError = (event) => {
    console.warn(`Imagen no encontrada para ${sabor.value.nombre}`)
    event.target.src = `${backendUrl}${defaultImage}`
    event.target.onerror = null
  }

  const verDetalles = () => {
    alert(`Sabor: ${sabor.value.nombre}`)
  }

  return {
    imagenUrl,
    handleImageError,
    verDetalles
  }
}