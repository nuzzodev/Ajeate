<template>
  <section id="productos" class="py-5 bg-white">
    <div class="container">
      <div class="text-center mb-5">
        <h2 class="display-5 fw-bold">Nuestros Combos</h2>
        <p class="lead text-muted">Selecciona tu combo favorito</p>
      </div>
      
      <EmpanadasCarrusel 
        :combos="combos" 
        :loading="loading"
        :error="error"
      />
    </div>
  </section>
</template>

<script>
import EmpanadasCarrusel from '../common/EmpanadasCarrusel.vue'
import { empanadasService } from '../../api/empanadasApi'
import { ref, onMounted } from 'vue'

export default {
  name: 'Products',
  components: {
    EmpanadasCarrusel
  },
  setup() {
    const combos = ref([])
    const loading = ref(true)
    const error = ref(null)

    const cargarCombos = async () => {
      try {
        loading.value = true
        const data = await empanadasService.getCombosParaCarrusel()
        combos.value = data
        error.value = null
      } catch (err) {
        console.error('Error cargando combos:', err)
        error.value = 'No se pudieron cargar los combos'
        // Datos de ejemplo
        combos.value = getCombosEjemplo()
      } finally {
        loading.value = false
      }
    }

    const getCombosEjemplo = () => {
      return [
        {
          id_combo: 1,
          cantidad_empanadas: 10,
          precio: "12.50",
          tipo_combo: { nombre: "Un Sabor" },
          sabores_info: [
            { id_sabor: 1, nombre: "Queso", imagen: "/images/sabores/1.jpg" }
          ]
        },
        {
          id_combo: 2,
          cantidad_empanadas: 20,
          precio: "22.50",
          tipo_combo: { nombre: "Dos Sabores" },
          sabores_info: [
            { id_sabor: 2, nombre: "Carne", imagen: "/images/sabores/2.jpg" },
            { id_sabor: 3, nombre: "Pollo", imagen: "/images/sabores/3.jpg" }
          ]
        }
      ]
    }

    onMounted(() => {
      cargarCombos()
    })

    return {
      combos,
      loading,
      error
    }
  }
}
</script>