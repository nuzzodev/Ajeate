<template>
  <div class="page-wrapper bg-white min-vh-100">
    <SectionHeader 
      title="Inventario" 
      subtitle="Materias Primas" 
      buttonText="Agregar Insumo"
      @primary-action="triggerCreate"
    />

    <main class="container py-2">
      <MateriasPrimasCrud ref="materiasRef" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SectionHeader from '@/components/layout/SectionHeader.vue';
import MateriasPrimasCrud from '../components/crud/MateriasPrimasCrud.vue';

const materiasRef = ref(null);

const triggerCreate = () => {
  materiasRef.value.openCreateModal();
};
</script>