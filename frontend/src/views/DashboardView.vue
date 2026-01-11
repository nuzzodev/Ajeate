<template>
  <div class="dashboard p-2 p-md-4">
    <div class="row mb-4 align-items-center">
      <div class="col">
        <h2 class="h3 fw-bold mb-1 text-dark">Dashboard Administrativo</h2>
        <p class="text-muted mb-0">
          <i class="bi bi-calendar3 me-2"></i>{{ fechaActual }} | 
          <strong>{{ authStore.user?.name }}</strong> 
          <span class="badge bg-secondary-subtle text-secondary ms-2 text-uppercase">
            {{ authStore.user?.role }}
          </span>
        </p>
      </div>
    </div>
    
    <StatsCard />

    <div class="row g-4">
      <div class="col-lg-4">
        <InventoryAlerts />
      </div>

      <div class="col-lg-8">
        <QuickAction />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';


import StatsCard from '@/components/dashboard/StatsCard.vue';
import InventoryAlerts from '@/components/dashboard/InventoryAlerts.vue';
import QuickAction from '@/components/dashboard/QuickAction.vue';

const authStore = useAuthStore();

const fechaActual = computed(() => {
  return new Intl.DateTimeFormat('es-ES', { 
    dateStyle: 'full' 
  }).format(new Date());
});
</script>