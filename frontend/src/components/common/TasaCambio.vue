<template>
  <div class="tasa-medalla">
    <!-- Encabezado de la medalla -->
    <div class="medalla-header d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center">
        <i class="bi bi-currency-exchange me-2"></i>
        <span>Tasa del Día</span>
      </div>
      <button 
        @click="actualizarTasa" 
        class="btn btn-actualizar btn-outline-dark btn-sm rounded-circle"
        :disabled="cargando"
        :class="{ 'tasa-actualizando': cargando }"
        title="Actualizar tasa"
      >
        <span v-if="cargando" class="spinner-border spinner-border-sm"></span>
        <i v-else class="bi bi-arrow-clockwise"></i>
      </button>
    </div>
    
    <!-- Cuerpo de la medalla -->
    <div class="medalla-body bg-white">
      <div class="mb-2">
        <div class="d-flex align-items-center mb-1">
          <span class="text-muted small">Dólar (USD)</span>
          <span v-if="cambioPorcentaje !== 0" 
                class="tasa-variacion ms-2"
                :class="cambioPorcentaje > 0 ? 'text-success' : 'text-danger'">
            <i :class="cambioPorcentaje > 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
            {{ Math.abs(cambioPorcentaje).toFixed(2) }}%
          </span>
        </div>
        <div class="tasa-valor">Bs. {{ formattedUSD }}</div>
      </div>
      
      <div class="d-flex justify-content-between align-items-center mt-3">
        <div>
          <small class="text-muted d-block">Actualizado:</small>
          <small class="tasa-fecha">{{ fecha }}</small>
        </div>
        <div class="text-end">
          <small class="text-muted d-block">Euro (EUR):</small>
          <small class="fw-medium">Bs. {{ formattedEUR }}</small>
        </div>
      </div>
      
      <!-- Indicador de última actualización -->
      <div class="progress mt-3" style="height: 3px;">
        <div class="progress-bar bg-warning" 
             :style="{ width: progresoActualizacion + '%' }"
             role="progressbar"></div>
      </div>
      <small class="text-muted d-block mt-1 text-center">
        Actualiza en {{ minutosRestantes }}:{{ segundosRestantes < 10 ? '0' : '' }}{{ segundosRestantes }}
      </small>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { tasaService } from '../../api/dolarApi'

export default {
  name: 'TasaCambio',
  setup() {
    // Datos de tasa
    const tasaUSD = ref(291.35)
    const tasaEUR = ref(342.94)
    const formattedUSD = ref('291.35')
    const formattedEUR = ref('342.94')
    const fecha = ref('')
    const cambioPorcentaje = ref(0)
    
    // Estado
    const cargando = ref(false)
    
    // Temporizador de actualización automática
    const tiempoTranscurrido = ref(0)
    const intervalo = ref(null)
    const TIEMPO_ACTUALIZACION = 60 * 60 // 5 minutos en segundos

    const cargarTasa = async () => {
      cargando.value = true
      try {
        const data = await tasaService.getTasaActual()
        tasaUSD.value = data.tasaUSD
        tasaEUR.value = data.tasaEUR
        formattedUSD.value = data.tasaUSD.toFixed(2)
        formattedEUR.value = data.tasaEUR.toFixed(2)
        fecha.value = formatearFecha(data.fecha)
        cambioPorcentaje.value = data.cambioPorcentajeUSD
        tiempoTranscurrido.value = 0 // Reiniciar contador
      } catch (error) {
        console.error('Error cargando tasa:', error)
        // Usar valores por defecto
        fecha.value = formatearFecha(new Date().toISOString().split('T')[0])
      } finally {
        cargando.value = false
      }
    }

    const formatearFecha = (fechaStr) => {
      const fechaObj = new Date(fechaStr)
      return fechaObj.toLocaleDateString('es-VE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }

    const actualizarTasa = () => {
      cargarTasa()
    }

    // Calculadores para el temporizador
    const minutosRestantes = computed(() => {
      const minutos = Math.floor((TIEMPO_ACTUALIZACION - tiempoTranscurrido.value) / 60)
      return minutos < 10 ? `0${minutos}` : minutos
    })

    const segundosRestantes = computed(() => {
      return (TIEMPO_ACTUALIZACION - tiempoTranscurrido.value) % 60
    })

    const progresoActualizacion = computed(() => {
      return (tiempoTranscurrido.value / TIEMPO_ACTUALIZACION) * 100
    })

    onMounted(() => {
      cargarTasa()
      
      // Iniciar temporizador para actualización automática
      intervalo.value = setInterval(() => {
        tiempoTranscurrido.value++
        
        // Si pasaron 5 minutos, actualizar
        if (tiempoTranscurrido.value >= TIEMPO_ACTUALIZACION) {
          cargarTasa()
        }
      }, 1000)
    })

    onUnmounted(() => {
      if (intervalo.value) {
        clearInterval(intervalo.value)
      }
    })

    return {
      tasaUSD,
      tasaEUR,
      formattedUSD,
      formattedEUR,
      fecha,
      cambioPorcentaje,
      cargando,
      actualizarTasa,
      minutosRestantes,
      segundosRestantes,
      progresoActualizacion
    }
  }
}
</script>