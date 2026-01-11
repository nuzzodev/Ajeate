<!-- MenuCarousel.vue -->
<template>
  <div>
    <!-- Estado de carga -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3 text-muted">Cargando nuestro menú...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-warning text-center">
      <i class="bi bi-exclamation-triangle me-2"></i>
      {{ error }}
    </div>

    <!-- Verificar si hay datos -->
    <div v-else-if="!itemsMenu || itemsMenu.length === 0" class="text-center py-5">
      <div class="alert alert-info">
        <i class="bi bi-info-circle me-2"></i>
        No hay combos disponibles.
      </div>
    </div>

    <!-- Carrusel de sabores/combos -->
    <div v-else>
      <!-- Grid si son 3 o menos items -->
      <div v-if="itemsMenu.length <= 3" class="row justify-content-center g-4">
        <div v-for="item in itemsMenu" 
             :key="item.id" 
             class="col-md-6 col-lg-4">
          <ItemCard :item="item" />
        </div>
      </div>

      <!-- Carrusel si hay más de 3 items -->
      <div v-else>
        <div id="menuCarousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div v-for="(grupo, index) in itemsAgrupados" 
                 :key="index"
                 :class="['carousel-item', { 'active': index === 0 }]">
              <div class="row justify-content-center g-4">
                <div v-for="item in grupo" 
                     :key="item.id" 
                     class="col-md-6 col-lg-4">
                  <ItemCard :item="item" />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Controles del carrusel -->
          <button class="carousel-control-prev" 
                  type="button" data-bs-target="#menuCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon bg-dark rounded-circle p-2" aria-hidden="true"></span>
            <span class="visually-hidden">Anterior</span>
          </button>
          <button class="carousel-control-next" 
                  type="button" data-bs-target="#menuCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon bg-dark rounded-circle p-2" aria-hidden="true"></span>
            <span class="visually-hidden">Siguiente</span>
          </button>
        </div>
        
        <!-- Indicadores -->
        <div class="text-center mt-4">
          <div class="carousel-indicators position-static">
            <button v-for="(grupo, index) in itemsAgrupados" 
                    :key="index"
                    type="button" 
                    data-bs-target="#menuCarousel" 
                    :data-bs-slide-to="index"
                    :class="['mx-1 rounded-circle', { 'active': index === 0 }]"
                    :aria-label="'Slide ' + (index + 1)"
                    style="width: 10px; height: 10px; background-color: #6c757d;"></button>
          </div>
        </div>
      </div>
      
      <!-- Contador de items -->
      <div class="text-center mt-4">
        <span class="badge bg-info">
          <i class="bi bi-basket me-1"></i>
          {{ itemsMenu.length }} opciones en el menú
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import ItemCard from './ItemCard.vue'
import { useMenuLogic } from '../composables/useMenuComposables.js'

const props = defineProps({
  combos: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null }
})

// Pasa todo el objeto props al composable
const { itemsMenu, itemsAgrupados } = useMenuLogic(props)
</script>

