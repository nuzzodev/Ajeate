import { computed } from 'vue'

export function useItemCard(item) {
  const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

  // --- Lógica de Formateo ---
  const formatearBolivares = (valor) => {
    return new Intl.NumberFormat('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor)
  }

  // --- Propiedades Computadas ---
  const precioFormateado = computed(() => {
    const precio = parseFloat(item.precio || 0)
    return precio.toFixed(2)
  })

  const precioEnBs = computed(() => {
    const precioUSD = parseFloat(item.precio || 0)
    const tasa = parseFloat(item.tasa || 1)
    return formatearBolivares(precioUSD * tasa)
  })

  const imagenItem = computed(() => {
    if (item.imagen) {
      if (item.imagen.startsWith('http')) return item.imagen
      const path = item.imagen.startsWith('/') ? '' : '/'
      return `${backendUrl}${path}${item.imagen}`
    }
    return `${backendUrl}/images/sabores/default.jpg`
  })

  // --- Acciones ---
  const handleImageError = (event) => {
    event.target.src = `${backendUrl}/images/sabores/default.jpg`
    event.target.onerror = null
  }

  return {
    precioFormateado,
    precioEnBs,
    imagenItem,
    handleImageError
  }
}