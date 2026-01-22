import { ref, computed, onMounted, onUnmounted } from 'vue';
import { tasaService } from '@/api/dolarApi';

export function useTasaCambio() {
  // Estado de los datos (sin valores de prueba)
  const tasaUSD = ref(0);
  const tasaEUR = ref(0);
  const fecha = ref('---');
  const cambioPorcentaje = ref(0);
  const cargando = ref(false);

  // Temporizador
  const tiempoTranscurrido = ref(0);
  const intervalo = ref(null);
  const TIEMPO_ACTUALIZACION = 60 * 60; // 1 hora en segundos (según tu código previo eran 60*60)

  // Getters formateados
  const formattedUSD = computed(() => tasaUSD.value.toFixed(2));
  const formattedEUR = computed(() => tasaEUR.value.toFixed(2));

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '---';
    const fechaObj = new Date(fechaStr);
    return fechaObj.toLocaleDateString('es-VE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const cargarTasa = async () => {
    cargando.value = true;
    try {
      const data = await tasaService.getTasaActual();
      tasaUSD.value = data.tasaUSD || 0;
      tasaEUR.value = data.tasaEUR || 0;
      fecha.value = formatearFecha(data.fecha);
      cambioPorcentaje.value = data.cambioPorcentajeUSD || 0;
      tiempoTranscurrido.value = 0; // Reiniciar contador tras éxito
    } catch (error) {
      console.error('Error cargando tasa:', error);
      fecha.value = "Error al cargar";
    } finally {
      cargando.value = false;
    }
  };

  // Lógica del temporizador
  const minutosRestantes = computed(() => {
    const minutos = Math.floor((TIEMPO_ACTUALIZACION - tiempoTranscurrido.value) / 60);
    return minutos < 10 ? `0${minutos}` : minutos;
  });

  const segundosRestantes = computed(() => {
    const segundos = (TIEMPO_ACTUALIZACION - tiempoTranscurrido.value) % 60;
    return segundos < 10 ? `0${segundos}` : segundos;
  });

  const progresoActualizacion = computed(() => {
    return (tiempoTranscurrido.value / TIEMPO_ACTUALIZACION) * 100;
  });

  // Ciclo de vida
  onMounted(() => {
    cargarTasa();
    intervalo.value = setInterval(() => {
      tiempoTranscurrido.value++;
      if (tiempoTranscurrido.value >= TIEMPO_ACTUALIZACION) {
        cargarTasa();
      }
    }, 1000);
  });

  onUnmounted(() => {
    if (intervalo.value) clearInterval(intervalo.value);
  });

  return {
    tasaUSD,
    tasaEUR,
    formattedUSD,
    formattedEUR,
    fecha,
    cambioPorcentaje,
    cargando,
    actualizarTasa: cargarTasa, // Alias para mayor claridad
    minutosRestantes,
    segundosRestantes,
    progresoActualizacion
  };
}