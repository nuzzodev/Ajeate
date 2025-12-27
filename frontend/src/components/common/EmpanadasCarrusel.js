import { computed } from 'vue'

export function useEmpanadasCarrusel(combos) {
  // Extraer sabores únicos de todos los combos
  const saboresUnicos = computed(() => {
    // Verificar que combos exista y sea un array
    if (!combos || !Array.isArray(combos.value)) {
      return []
    }
    
    const saboresMap = new Map()
    
    combos.value.forEach(combo => {
      if (combo?.sabores_info && Array.isArray(combo.sabores_info)) {
        combo.sabores_info.forEach(sabor => {
          if (sabor?.id_sabor && !saboresMap.has(sabor.id_sabor)) {
            saboresMap.set(sabor.id_sabor, {
              ...sabor,
              // Si no tiene imagen, usar la ruta por defecto con su ID
              imagen: sabor.imagen || `/images/sabores/${sabor.id_sabor}.jpg`
            })
          }
        })
      }
    })
    
    // Convertir a array
    return Array.from(saboresMap.values())
  })

  // Agrupar sabores en slides de 3 para carrusel
  const saboresAgrupados = computed(() => {
    if (saboresUnicos.value.length === 0) {
      return []
    }
    
    const grupos = []
    const itemsPorSlide = 3
    
    for (let i = 0; i < saboresUnicos.value.length; i += itemsPorSlide) {
      grupos.push(saboresUnicos.value.slice(i, i + itemsPorSlide))
    }
    
    return grupos
  })

  return {
    saboresUnicos,
    saboresAgrupados
  }
}