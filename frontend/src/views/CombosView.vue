<template>
  <div class="container mt-4">
    <SectionHeader 
      title="Gestión de Combos" 
      subtitle="Administra la configuración y sabores de tus combos" 
      buttonText="Nuevo Combo"
      @primary-action="triggerCreate"
    />
    <CombosCrud ref="combosCrudRef"/>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SectionHeader from '../components/layout/SectionHeader.vue';
import CombosCrud from '../components/crud/CombosCrud.vue';

// Referencia al componente hijo
const combosCrudRef = ref(null);

const triggerCreate = () => {
  // Llamamos al método expuesto en el hijo
  combosCrudRef.value?.openCreateModal();
};
</script>