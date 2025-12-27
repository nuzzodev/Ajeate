<template>
  <div class="container mt-4">
    <h1 class="mb-4">Bandejas</h1>
    <BandejasCrud />
  </div>
</template>

<script>
import BandejasCrud from '../components/crud/BandejasCrud.vue'
export default {
  components: { BandejasCrud }
}
</script>