<template>
  <div class="container mt-4">
    <h1 class="mb-4">Lotes</h1>
    <LotesCrud />
  </div>
</template>

<script>
import LotesCrud from '../components/crud/LotesCrud.vue'
export default {
  components: { LotesCrud }
}
</script>