<template>
  <div class="page-wrapper bg-white min-vh-100">
    <SectionHeader 
      title="Gestión" 
      subtitle="Sabores de Empanadas" 
      buttonText="Nuevo Sabor"
      @primary-action="triggerCreate"
    />

    <main class="container py-2">
      <SaboresCrud ref="saboresRef" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SectionHeader from '@/components/layout/SectionHeader.vue';
import SaboresCrud from '@/components/crud/SaboresCrud.vue';

const saboresRef = ref(null);

const triggerCreate = () => {
  saboresRef.value.openCreateModal();
};
</script>