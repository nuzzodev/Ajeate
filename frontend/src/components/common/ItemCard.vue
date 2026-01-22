

<template>
  <div class="card h-100 shadow-sm item-card rounded-3 border border-warning border-3 p-1">
    <div class="card-img-top position-relative" style="height: 200px; overflow: hidden;">
      <img :src="imagenItem" 
           :alt="item.nombre" 
           class="w-100 h-100 object-fit-cover"
           @error="handleImageError"
           loading="lazy">
      
      <div class="position-absolute top-0 start-0 m-2">
        <span :class="['badge', item.tipo === 'variado' ? 'bg-success' : 'bg-warning text-dark']">
          <i :class="item.tipo === 'variado' ? 'bi bi-stars' : 'bi bi-egg-fried'" class="me-1"></i>
          {{ item.tipo === 'variado' ? 'Variado' : 'Individual' }}
        </span>
      </div>
      
      <div class="position-absolute top-0 end-0 m-2">
        <span class="badge bg-info">
          <i class="bi bi-123 me-1"></i>
          {{ item.cantidad_empanadas }} und.
        </span>
      </div>
      
      <div class="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-75 text-white p-2">
        <h6 class="mb-0 text-center fw-bold">{{ item.nombre }}</h6>
      </div>
    </div>
    
    <div class="card-body text-center">
      <p class="text-muted small mb-3">{{ item.descripcion }}</p>
      
      <div class="mb-3">
        <small class="text-muted d-block mb-1">Precio:</small>
        <div class="d-flex justify-content-center align-items-center">
          <span class="h5 text-muted mb-0">${{ precioFormateado }}</span>
          <small class="text-muted ms-2">USD</small>
        </div>
        <div class="mt-1">
          <span class="h4 text-primary fw-bold mb-0">Bs. {{ precioEnBs }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useItemCard } from '../composables/useItemCard'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// Pasamos el objeto item de las props al composable
const { 
  precioFormateado, 
  precioEnBs, 
  imagenItem, 
  handleImageError 
} = useItemCard(props.item)

</script>