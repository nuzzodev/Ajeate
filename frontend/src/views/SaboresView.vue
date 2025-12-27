<template>
  <div class="container mt-4">
    <h1 class="mb-4">Sabores</h1>
    <SaboresCrud />
  </div>
</template>

<script>
import SaboresCrud from '../components/crud/SaboresCrud.vue'
export default {
  components: { SaboresCrud }
}
</script>