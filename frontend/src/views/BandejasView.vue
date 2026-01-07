<template>
  <div class="page-wrapper bg-white min-vh-100">
    <SectionHeader 
      title="Bandejas" 
      subtitle="Control de Bandejas" 
      buttonText="Nueva Producción"
      @primary-action="triggerCreate"
    />

    <main class="container py-2">
      <BandejasCrud ref="bandejasRef" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SectionHeader from '@/components/layout/SectionHeader.vue';
import BandejasCrud from '@/components/crud/BandejasCrud.vue';

// Creamos una referencia al componente hijo
const bandejasRef = ref(null);

// Cuando el Header emite el clic, llamamos a la función dentro de BandejasCrud
const triggerCreate = () => {
  bandejasRef.value.openCreateModal();
};
</script>