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
        const data = await empanadasService.getCombos()
        combos.value = data
        error.value = null
      } catch (err) {
        console.error('Error cargando combos:', err)
        error.value = 'No se pudieron cargar los combos'
      } finally {
        loading.value = false
      }
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