<template>
  <header class="section-header bg-dark text-white shadow-lg mb-5">
    <div class="container py-4">
      <div class="row align-items-center">
        <div class="col-12 col-md-7 mb-3 mb-md-0 text-center text-md-start">
          <h1 class="display-6 fw-bold mb-0">
            <span class="text-warning">Ajeate</span> {{ title }}
          </h1>
          <div class="h6 text-warning text-uppercase tracking-widest opacity-75 mt-1">
            {{ subtitle }}
          </div>
        </div>
        
        <div class="col-12 col-md-5 text-center text-md-end">
          <button 
            @click="$emit('primary-action')" 
            class="btn btn-warning btn-lg fw-bold rounded-pill px-4 py-2 shadow-sm hover-scale"
          >
            <i class="bi bi-plus-circle-fill me-2"></i> {{ buttonText }}
          </button>
        </div>
      </div>
    </div>
    <div class="brand-line bg-warning"></div>
  </header>
</template>

<script setup>
defineProps({
  title: String,      // Ej: "Admin"
  subtitle: String,   // Ej: "Gestión de Bandejas"
  buttonText: String  // Ej: "Registrar Tanda"
});
defineEmits(['primary-action']);
</script>

<style scoped>
.tracking-widest { letter-spacing: 0.2rem; font-size: 0.8rem; }
.brand-line { height: 4px; width: 100%; }
.hover-scale { transition: transform 0.2s; }
.hover-scale:active { transform: scale(0.95); }

.section-header {
  border-bottom: 1px solid rgba(255, 193, 7, 0.2);
}
</style>