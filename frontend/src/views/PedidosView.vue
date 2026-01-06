<template>
  <div class="page-wrapper bg-white min-vh-100">
    <SectionHeader 
      title="Gestión" 
      subtitle="Pedidos de Clientes" 
      buttonText="Nuevo Pedido"
      @primary-action="triggerCreate"
    />

    <main class="container py-2">
      <PedidosCrud ref="pedidosRef" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SectionHeader from '@/components/layout/SectionHeader.vue';
import PedidosCrud from '@/components/crud/PedidosCrud.vue';

const pedidosRef = ref(null);

const triggerCreate = () => {
  // Llama a la función expuesta en el hijo
  pedidosRef.value.openCreateModal();
};
</script>