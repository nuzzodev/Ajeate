import { ref, onMounted, computed, watch } from 'vue'
import * as bootstrap from 'bootstrap'
import { empanadasService } from '../../api/empanadasApi' 
import { alerts } from '@/utils/alerts' 

export function useCombos() {
  // --- ESTADO ---
  const combos = ref([])
  const pedidos = ref([])
  const tiposCombo = ref([])
  const bandejas = ref([])
  const isLoading = ref(false)
  const editing = ref(false)
  const combosEnCreacion = ref([]) // <--- Estado para creación múltiple
  
  const currentCombo = ref({ 
    cantidad_empanadas: 10, 
    tipo_combo_fk: '', 
    pedido_fk: '', 
    sabores_seleccionados: {} 
  })
  const selectedCombo = ref(null) 

  // Instancias de Bootstrap
  let modalInstance = null
  let detailsModalInstance = null

  // --- COMPUTADAS ---
  const totalAsignado = computed(() => {
    return Object.values(currentCombo.value.sabores_seleccionados)
                 .reduce((acc, val) => acc + (Number(val) || 0), 0)
  })

  // --- WATCHERS (Autorelleno para un combo individual) ---
  // Nota: Si usas creación múltiple, podrías necesitar un watcher más complejo, 
  // pero este sirve para el combo que estés editando actualmente.
  watch(() => currentCombo.value.tipo_combo_fk, (newTipo) => {
    if (newTipo && newTipo !== 1 && bandejas.value.length >= 4) {
      currentCombo.value.sabores_seleccionados = {};
      const disponibles = bandejas.value.filter(b => b.cantidad_disponible > 0);
      const seleccionadas = disponibles.sort(() => 0.5 - Math.random()).slice(0, 4);
      
      const total = currentCombo.value.cantidad_empanadas;
      const base = Math.floor(total / 4);
      const resto = total % 4;

      seleccionadas.forEach((bandeja, index) => {
        currentCombo.value.sabores_seleccionados[bandeja.id_bandeja] = base + (index < resto ? 1 : 0);
      });
      alerts.success('Sugerencia generada', '4 bandejas seleccionadas');
    } else if (newTipo === 1) {
      currentCombo.value.sabores_seleccionados = {};
    }
  });

  // --- CARGA DE DATOS ---
  const fetchData = async () => {
    isLoading.value = true;
    try {
      const combosRes = await empanadasService.getCombos();
      combos.value = combosRes || [];
      
      try {
        const bandejasRes = await empanadasService.getBandejas(); 
        bandejas.value = bandejasRes.filter(b => b.cantidad_disponible > 0) || [];
      } catch (e) { console.warn("Error bandejas:", e); }

      try { pedidos.value = await empanadasService.getPedidos(); } catch (e) {}
      try { tiposCombo.value = await empanadasService.getTipoCombos(); } catch (e) {}
      
    } catch (error) {
      alerts.error('Error', 'No se pudo cargar la información');
    } finally {
      isLoading.value = false;
    }
  }

  // --- CICLO DE VIDA ---
  onMounted(() => {
    const modalEl = document.getElementById('comboModal')
    if (modalEl) modalInstance = new bootstrap.Modal(modalEl)
    
    const detailsEl = document.getElementById('detailsComboModal')
    if (detailsEl) detailsModalInstance = new bootstrap.Modal(detailsEl)
    
    fetchData()
  })

  // --- GESTIÓN DE LISTA DE COMBOS ---
const agregarComboALista = () => {
  combosEnCreacion.value.push({
    uuid: self.crypto.randomUUID(),
    cantidad_empanadas: 10,
    tipo_combo_fk: '',
    pedido_fk: currentCombo.value.pedido_fk, // <--- Importante: hereda el pedido del select general
    sabores_seleccionados: {}
  })
}

  const eliminarComboDeLista = (index) => {
    combosEnCreacion.value.splice(index, 1)
  }

  // --- ACCIONES ---
  const openCreateModal = () => {
    editing.value = false
    // Reiniciamos la lista de creación masiva
    combosEnCreacion.value = []
    agregarComboALista() // Empezamos con uno
    
    // Reiniciamos el combo individual por si acaso
    currentCombo.value = { 
      cantidad_empanadas: 10, 
      tipo_combo_fk: '', 
      pedido_fk: '', 
      sabores_seleccionados: {} 
    }
    modalInstance?.show()
  }

  const openDetailsModal = (combo) => {
    selectedCombo.value = combo
    detailsModalInstance?.show()
  }

const saveMultipleCombos = async () => {
  try {
    isLoading.value = true;
    
    // Validamos que haya un pedido seleccionado
    if (!currentCombo.value.pedido_fk) {
      alerts.error('Falta información', 'Por favor selecciona un pedido.');
      return;
    }

    // USAMOS UN BUCLE FOR...OF para que sea SECUENCIAL
    for (const [index, c] of combosEnCreacion.value.entries()) {
      const detalles = Object.entries(c.sabores_seleccionados)
        .filter(([_, cant]) => cant > 0)
        .map(([bandejaId, cant]) => ({
          cantidad_por_sabor: cant,
          bandeja_fk: parseInt(bandejaId)
        }));

      const payload = {
        combo: {
          cantidad_empanadas: c.cantidad_empanadas,
          tipo_combo_fk: c.tipo_combo_fk,
          pedido_fk: currentCombo.value.pedido_fk,
          combo_detalles_attributes: detalles
        }
      };

      // Esperamos a que termine este ANTES de seguir con el siguiente
      await empanadasService.createCombo(payload);
      console.log(`Combo ${index + 1} creado con éxito`);
    }

    alerts.success('¡Éxito!', `Se crearon ${combosEnCreacion.value.length} combos correctamente.`);
    await fetchData();
    modalInstance?.hide();
  } catch (error) {
    console.error("Error en la cadena de creación:", error);
    alerts.error('Error', 'Ocurrió un problema al crear los combos. Verifica el stock.');
  } finally {
    isLoading.value = false;
  }
};

  // Guardado Individual (Mantenido por compatibilidad)
  const saveCombo = async () => {
    // Si hay varios en la lista, usamos la lógica masiva
    if (combosEnCreacion.value.length > 1) {
        return saveMultipleCombos();
    }

    // Si solo hay uno, validamos ese específico
    if (totalAsignado.value !== currentCombo.value.cantidad_empanadas) {
      alerts.error('Error', `Asigna exactamente ${currentCombo.value.cantidad_empanadas} empanadas.`);
      return;
    }

    try {
      const detallesAttributes = Object.entries(currentCombo.value.sabores_seleccionados)
        .filter(([_, cant]) => cant > 0)
        .map(([bandejaId, cant]) => ({
          cantidad_por_sabor: cant,
          bandeja_fk: parseInt(bandejaId) 
        }));

      await empanadasService.createCombo({
        combo: {
          cantidad_empanadas: currentCombo.value.cantidad_empanadas,
          tipo_combo_fk: currentCombo.value.tipo_combo_fk,
          pedido_fk: currentCombo.value.pedido_fk,
          combo_detalles_attributes: detallesAttributes
        }
      });

      alerts.success('¡Combo Guardado!');
      await fetchData();
      modalInstance?.hide();
    } catch (error) {
      alerts.error('Error', 'No se pudo guardar');
    }
  };

  return {
    combos, pedidos, tiposCombo, bandejas, currentCombo, selectedCombo,
    combosEnCreacion, agregarComboALista, eliminarComboDeLista, saveMultipleCombos,
    totalAsignado, editing, isLoading, saveCombo, fetchData,
    openCreateModal, openDetailsModal
  }
}