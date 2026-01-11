<template>
  <div class="row g-4 mb-4">
    <div v-for="stat in stats" :key="stat.label" class="col-md-3">
      <div :class="['card border-0 shadow-sm h-100', stat.bgClass, stat.textClass]">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h6 class="card-title mb-0 opacity-75 small text-uppercase fw-bold">{{ stat.label }}</h6>
            <h3 class="mb-0 fw-bold">{{ stat.value }}</h3>
          </div>
          <i :class="['bi', stat.icon, 'display-6 opacity-50']"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { empanadasService } from '@/api/empanadasApi';

const stats = ref([
  { label: 'Clientes', value: 0, icon: 'bi-people', bgClass: 'bg-primary', textClass: 'text-white' },
  { label: 'Pedidos', value: 0, icon: 'bi-clipboard-check', bgClass: 'bg-success', textClass: 'text-white' },
  { label: 'Empanadas', value: 0, icon: 'bi-egg-fried', bgClass: 'bg-warning', textClass: 'text-dark' },
  { label: 'Bandejas', value: 0, icon: 'bi-tray', bgClass: 'bg-info', textClass: 'text-white' }
]);

onMounted(async () => {
  try {
    const [clientes, pedidos, combos, bandejas] = await Promise.all([
      empanadasService.getClientes(),
      empanadasService.getPedidos(),
      empanadasService.getCombos(),
      empanadasService.getBandejas()
    ]);
    stats.value[0].value = clientes.length;
    stats.value[1].value = pedidos.length;
    stats.value[2].value = combos.reduce((acc, c) => acc + (c.cantidad_empanadas || 0), 0);
    stats.value[3].value = bandejas.length;
  } catch (e) {
    console.error("Error cargando stats dashboard", e);
  }
});
</script>