<template>
  <div class="card h-100  shadow-sm item-card rounded-3 border border-warning border-3 p-1">
    <!-- Imagen -->
    <div class="card-img-top position-relative " style="height: 200px; overflow: hidden;">
      <img :src="imagenItem" 
           :alt="item.nombre" 
           class="w-100 h-100 object-fit-cover"
           @error="handleImageError"
           loading="lazy">
      
      <!-- Badge del tipo -->
      <div class="position-absolute top-0 start-0 m-2">
        <span :class="['badge', item.tipo === 'variado' ? 'bg-success' : 'bg-warning text-dark']">
          <i :class="item.tipo === 'variado' ? 'bi bi-stars' : 'bi bi-egg-fried'" class="me-1"></i>
          {{ item.tipo === 'variado' ? 'Variado' : 'Individual' }}
        </span>
      </div>
      
      <!-- Badge de cantidad -->
      <div class="position-absolute top-0 end-0 m-2">
        <span class="badge bg-info">
          <i class="bi bi-123 me-1"></i>
          {{ item.cantidad_empanadas }} und.
        </span>
      </div>
      
      <!-- Nombre del item -->
      <div class="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-75 text-white p-2">
        <h6 class="mb-0 text-center fw-bold">{{ item.nombre }}</h6>
      </div>
    </div>
    
    <!-- Cuerpo de la tarjeta -->
    <div class="card-body text-center">
      <!-- Descripción -->
      <p class="text-muted small mb-3">
        {{ item.descripcion }}
      </p>
      
      
      
      <!-- Precio -->
      <div class="mb-3">
        <small class="text-muted d-block mb-1">Precio:</small>
        
        <div class="d-flex justify-content-center align-items-center">
          <span class="h5 text-muted mb-0">
            ${{ precioFormateado }}
          </span>
          <small class="text-muted ms-2">USD</small>
        </div>

        <div class="mt-1">
          <span class="h4 text-primary fw-bold mb-0">
            Bs. {{ precioEnBs }}
          </span>
        </div>

      </div>
      
      
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// --- LÓGICA DE PRECIOS Y CONVERSIÓN ---

// Formateador para moneda venezolana (puntos para miles, coma para decimales)
const formatearBolivares = (valor) => {
  return new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor)
}

const precioFormateado = computed(() => {
  const precio = parseFloat(props.item.precio || 0)
  return precio.toFixed(2)
})

const precioEnBs = computed(() => {
  const precioUSD = parseFloat(props.item.precio || 0)
  const tasa = parseFloat(props.item.tasa || 1) // Recibe la tasa del padre
  return formatearBolivares(precioUSD * tasa)
})

const precioPorUnidad = computed(() => {
  const precioTotal = parseFloat(props.item.precio || 0)
  const cantidad = props.item.cantidad_empanadas || 1
  const precioUnitario = precioTotal / cantidad
  return `$${precioUnitario.toFixed(2)}`
})

// --- RESTO DE COMPUTED (SABORES E IMAGEN) ---

const saboresUnicos = computed(() => {
  if (!props.item.sabores || !Array.isArray(props.item.sabores)) return []
  return props.item.sabores.slice(0, 3)
})

const imagenItem = computed(() => {
  if (props.item.imagen) {
    if (props.item.imagen.startsWith('http')) return props.item.imagen
    return `${backendUrl}${props.item.imagen.startsWith('/') ? '' : '/'}${props.item.imagen}`
  }
  return `${backendUrl}/images/sabores/default.jpg`
})

const handleImageError = (event) => {
  event.target.src = `${backendUrl}/images/sabores/default.jpg`
  event.target.onerror = null
}

const seleccionarItem = () => {
  console.log('Item seleccionado:', props.item)
}
</script>