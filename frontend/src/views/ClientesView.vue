<template>
  <div class="container mt-4">
    <h1 class="mb-4">Clientes</h1>
    <ClientesCrud />
  </div>
</template>

<script>
import ClientesCrud from '../components/crud/ClientesCrud.vue'
export default {
  components: { ClientesCrud }
}
</script>