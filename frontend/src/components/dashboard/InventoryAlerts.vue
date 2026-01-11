<template>
  <div class="card border-0 shadow-sm h-100">
    <div class="card-header bg-white border-0 py-3">
      <h6 class="mb-0 fw-bold text-danger">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>Alertas de Inventario
      </h6>
    </div>
    <div class="card-body pt-0">
      <div v-if="lowStock.length === 0" class="text-muted small py-3 text-center">
        Todo el inventario está en niveles óptimos.
      </div>
      <div v-else class="list-group list-group-flush">
        <div v-for="item in lowStock" :key="item.id_materia_prima" class="list-group-item px-0 py-2 border-0 d-flex justify-content-between align-items-center">
          <span class="small fw-medium">{{ item.nombre }}</span>
          <span class="badge bg-danger-subtle text-danger rounded-pill">{{ item.stock }} {{ item.unidad_medida }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { empanadasService } from '@/api/empanadasApi';

const lowStock = ref([]);

onMounted(async () => {
  try {
    const res = await empanadasService.getMateriasPrimasBajoInventario();
    lowStock.value = res.slice(0, 5); // Mostrar solo las 5 más críticas
  } catch (e) {
    console.warn("No se pudieron cargar alertas de inventario");
  }
});
</script>