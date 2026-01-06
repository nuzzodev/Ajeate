<template>
  <div class="container-fluid px-lg-5 mt-4">
    <SectionHeader 
      title="Clientes" 
      subtitle="Gestión de Directorio" 
      buttonText="Nuevo Cliente"
      @primary-action="triggerCreate"
    />
    <ClientesCrud ref="clientesCrudRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SectionHeader from '../components/layout/SectionHeader.vue';
import ClientesCrud from '../components/crud/ClientesCrud.vue';

const clientesCrudRef = ref(null);

const triggerCreate = () => {
  clientesCrudRef.value?.openCreateModal();
};
</script>