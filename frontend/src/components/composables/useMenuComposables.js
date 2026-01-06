//  composables/useMenuComposables.js
import { ref, computed, onMounted, toRefs } from 'vue'
import { tasaService } from '../../api/dolarApi.js'

export function useMenuLogic(props) {
  // Convierte las props a referencias reactivas
  const { combos, loading, error } = toRefs(props)
  const tasaUSD = ref(1)
  
  const itemsMenu = computed(() => {
    // Usa combos.value ya que es una ref
    if (!Array.isArray(combos.value) || combos.value.length === 0) return []
    
    const cartas = []
    const saboresVistos = new Set()

    combos.value.forEach(combo => {
      if (combo.sabores_info && combo.sabores_info.length === 1) {
        const sabor = combo.sabores_info[0]
        
        if (!saboresVistos.has(sabor.id_sabor)) {
          cartas.push({
            id: `sabor-${sabor.id_sabor}`,
            tipo: 'sabor',
            nombre: sabor.nombre,
            descripcion: `Combo tradicional de ${sabor.nombre}`,
            precio: combo.precio || 0,
            tasa: tasaUSD.value,
            cantidad_empanadas: combo.cantidad_empanadas,
            imagen: sabor.imagen || '/images/sabores/default.jpg',
            sabores: [sabor]
          })
          saboresVistos.add(sabor.id_sabor)
        }
      }
    })

    const comboVariadoEjemplo = combos.value.find(c => 
      (c.tipo_combo?.nombre || '').toLowerCase().includes('variado') || 
      (c.sabores_info && c.sabores_info.length > 1)
    )

    if (comboVariadoEjemplo) {
      cartas.push({
        id: 'variado-unico',
        tipo: 'variado',
        nombre: 'Combo Variado',
        descripcion: '¡Combina tus sabores favoritos!',
        precio: comboVariadoEjemplo.precio || 0,
        tasa: tasaUSD.value,
        cantidad_empanadas: comboVariadoEjemplo.cantidad_empanadas,
        imagen: '/images/sabores/variado.jpg',
        sabores: comboVariadoEjemplo.sabores_info
      })
    }

    return cartas.sort((a, b) => a.nombre.localeCompare(b.nombre))
  })

  const itemsAgrupados = computed(() => {
    if (itemsMenu.value.length === 0) return []
    const grupos = []
    const itemsPorSlide = 3
    for (let i = 0; i < itemsMenu.value.length; i += itemsPorSlide) {
      grupos.push(itemsMenu.value.slice(i, i + itemsPorSlide))
    }
    return grupos
  })

  const loadTasa = async () => {
    try {
      const data = await tasaService.getTasaActual()
      tasaUSD.value = data.tasaUSD
    } catch (err) {
      console.error("Error al cargar la tasa:", err)
      tasaUSD.value = 1 // Valor por defecto
    }
  }

  onMounted(() => {
    loadTasa()
  })

  return {
    tasaUSD,
    itemsMenu,
    itemsAgrupados,
    loadTasa
  }
}