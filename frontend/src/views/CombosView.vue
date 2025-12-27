<template>
  <div class="container mt-4">
    <h1 class="mb-4">Combos</h1>
    <CombosCrud />
  </div>
</template>

<script>
import CombosCrud from '../components/crud/CombosCrud.vue'
export default {
  components: { CombosCrud }
}
</script>