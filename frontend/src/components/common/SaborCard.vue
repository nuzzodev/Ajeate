<template>
  <div class="card h-100 border-0 shadow-sm">
    <!-- Imagen del sabor -->
    <div class="card-img-top" style="height: 200px; overflow: hidden;">
      <img :src="imagenUrl" 
           :alt="sabor.nombre" 
           class="w-100 h-100 object-fit-cover"
           @error="handleImageError"
           loading="lazy">
    </div>
    
    <!-- Cuerpo de la tarjeta -->
    <div class="card-body text-center">
      <!-- Nombre del sabor -->
      <h5 class="card-title fw-bold mb-3">{{ sabor.nombre }}</h5>
      
      <!-- Descripción simple -->
      <p class="text-muted small mb-4">
        Disponible en diferentes combinaciones
      </p>
      
      <!-- Botón simple -->
      <button class="btn btn-warning w-100" @click="verDetalles">
        <i class="bi bi-eye me-2"></i>Ver Detalles
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useSaborCard } from './SaborCard.js'

const props = defineProps({
  sabor: {
    type: Object,
    required: true
  }
})

const { imagenUrl, handleImageError, verDetalles } = useSaborCard(() => props.sabor)
</script>

