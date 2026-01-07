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
  const combosEnCreacion = ref([])
  
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

  // --- FUNCIÓN PARA AUTORELLENAR UN COMBO ---
  const autoRellenarCombo = (combo) => {
    if (combo.tipo_combo_fk && combo.tipo_combo_fk !== 1 && bandejas.value.length >= 4) {
      combo.sabores_seleccionados = {};
      const disponibles = bandejas.value.filter(b => b.cantidad_disponible > 0);
      const seleccionadas = disponibles.sort(() => 0.5 - Math.random()).slice(0, 4);
      
      const total = combo.cantidad_empanadas;
      const base = Math.floor(total / 4);
      const resto = total % 4;

      seleccionadas.forEach((bandeja, index) => {
        combo.sabores_seleccionados[bandeja.id_bandeja] = base + (index < resto ? 1 : 0);
      });
      alerts.success('Sugerencia generada', '4 bandejas seleccionadas');
    } else if (combo.tipo_combo_fk === 1) {
      combo.sabores_seleccionados = {};
    }
  }

  // --- WATCHERS ---
  // Watcher para currentCombo (individual) - mantenido por compatibilidad
  watch(() => currentCombo.value.tipo_combo_fk, (newTipo) => {
    if (newTipo) {
      autoRellenarCombo(currentCombo.value);
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

  // --- FUNCIÓN PARA OBTENER DETALLES DE UN COMBO ---
  const fetchComboDetails = async (id) => {
    try {
      const response = await empanadasService.getComboById(id);
      selectedCombo.value = response;
      return response;
    } catch (error) {
      console.error("Error fetching combo details:", error);
      alerts.error('Error', 'No se pudieron cargar los detalles del combo');
      return null;
    }
  };

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
    const nuevoCombo = {
      uuid: window.crypto.randomUUID(),
      cantidad_empanadas: 10,
      tipo_combo_fk: '',
      pedido_fk: currentCombo.value.pedido_fk,
      sabores_seleccionados: {}
    };
    
    combosEnCreacion.value.push(nuevoCombo);
    
    // Si hay bandejas disponibles, podemos observar cambios en este combo específico
    if (bandejas.value.length > 0) {
      // Usamos un watcher local para este combo específico
      watch(
        () => nuevoCombo.tipo_combo_fk,
        (newTipo) => {
          if (newTipo) {
            autoRellenarCombo(nuevoCombo);
          }
        },
        { immediate: false }
      );
    }
  }

  const eliminarComboDeLista = (index) => {
    combosEnCreacion.value.splice(index, 1)
  }

  // --- ACCIONES ---
  const openCreateModal = () => {
    editing.value = false
    combosEnCreacion.value = []
    agregarComboALista()
    
    currentCombo.value = { 
      cantidad_empanadas: 10, 
      tipo_combo_fk: '', 
      pedido_fk: '', 
      sabores_seleccionados: {} 
    }
    modalInstance?.show()
  }

  const openDetailsModal = async (combo) => {
    try {
      const comboDetails = await fetchComboDetails(combo.id_combo);
      if (comboDetails) {
        selectedCombo.value = comboDetails;
        if (detailsModalInstance) {
          detailsModalInstance.show();
        } else {
          const detailsEl = document.getElementById('detailsComboModal');
          if (detailsEl) {
            detailsModalInstance = new bootstrap.Modal(detailsEl);
            detailsModalInstance.show();
          }
        }
      }
    } catch (error) {
      console.error("Error al abrir detalles:", error);
      alerts.error('Error', 'No se pudo abrir los detalles del combo');
    }
  };

  // --- MÉTODO PARA ACTUALIZAR UN COMBO ESPECÍFICO EN LA LISTA ---
  const actualizarComboEnLista = (index, campo, valor) => {
    if (combosEnCreacion.value[index]) {
      combosEnCreacion.value[index][campo] = valor;
      
      // Si se cambió el tipo de combo, aplicar auto-relleno
      if (campo === 'tipo_combo_fk' && valor) {
        autoRellenarCombo(combosEnCreacion.value[index]);
      }
    }
  }

  const saveMultipleCombos = async () => {
    try {
      isLoading.value = true;
      
      if (!currentCombo.value.pedido_fk) {
        alerts.error('Falta información', 'Por favor selecciona un pedido.');
        return;
      }

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

        await empanadasService.createCombo(payload);
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

  const saveCombo = async () => {
    if (combosEnCreacion.value.length > 1) {
      return saveMultipleCombos();
    }

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
    openCreateModal, openDetailsModal, actualizarComboEnLista, autoRellenarCombo
  }
}