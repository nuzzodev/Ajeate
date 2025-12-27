<template>
  <div class="precio-convertido">
    <div class="d-flex align-items-center">
      <span class="text-success">{{ precioBS }}</span>
      <small class="text-muted ms-2">BS</small>
      <span v-if="mostrarInfo" class="ms-2">
        <i class="bi bi-info-circle text-info" style="font-size: 0.8rem;"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { currencyUtils } from '../../utils/currency'

export default {
  name: 'PrecioConvertido',
  props: {
    precio: {
      type: [Number, String],
      required: true
    },
    mostrarInfo: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const precioNumero = computed(() => {
      return typeof props.precio === 'string' ? parseFloat(props.precio) : props.precio
    })

    const precioBS = ref('Calculando...')
    const cargando = ref(false)

    const actualizarConversion = async () => {
      if (isNaN(precioNumero.value)) {
        precioBS.value = 'Precio inválido'
        return
      }

      cargando.value = true
      try {
        const bs = await currencyUtils.convertUsdToBs(precioNumero.value)
        precioBS.value = `Bs. ${bs.toFixed(2)}`
      } catch (error) {
        console.error('Error convirtiendo precio:', error)
        precioBS.value = 'Error en conversión'
      } finally {
        cargando.value = false
      }
    }

    onMounted(() => {
      actualizarConversion()
    })

    watch(() => props.precio, () => {
      actualizarConversion()
    })

    return {
      precioBS
    }
  }
}
</script>

<style scoped>
.precio-convertido {
  font-size: 0.9rem;
}
</style>