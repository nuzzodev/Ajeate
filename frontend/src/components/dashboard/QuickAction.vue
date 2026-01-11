<template>
  <div class="card border-0 shadow-sm h-100">
    <div class="card-header bg-white border-0 py-3">
      <h6 class="mb-0 fw-bold text-muted text-uppercase small">Acciones Rápidas</h6>
    </div>
    <div class="card-body">
      <div class="row g-2">
        <div v-for="link in links" :key="link.to" class="col-6">
          <router-link :to="link.to" class="btn btn-outline-light border text-dark w-100 py-3 shadow-sm-hover transition-all">
            <i :class="['bi', link.icon, link.color, 'fs-4 d-block mb-1']"></i>
            <span class="small fw-bold">{{ link.label }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const links = [
  { to: '/admin/pedidos', label: 'Nuevo Pedido', icon: 'bi-plus-circle', color: 'text-success' },
  { to: '/admin/clientes', label: 'Nuevo Cliente', icon: 'bi-person-plus', color: 'text-primary' },
  { to: '/admin/bandejas', label: 'Rellenar Bandeja', icon: 'bi-inboxes', color: 'text-warning' },
  { to: '/admin/lotes', label: 'Nuevo Lote', icon: 'bi-box-seam', color: 'text-info' }
];
</script>

<style scoped>
.transition-all { transition: all 0.2s; }
.shadow-sm-hover:hover { 
  background-color: #f8f9fa; 
  transform: translateY(-2px);
  box-shadow: 0 .125rem .25rem rgba(0,0,0,.075);
}
</style>