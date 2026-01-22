<template>
  <div class="tasa-medalla">
    <div class="medalla-header d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center">
        <i class="bi bi-currency-exchange me-2"></i>
        <span>Tasa del Día</span>
      </div>
      <button 
        @click="actualizarTasa" 
        class="btn btn-actualizar btn-outline-dark btn-sm rounded-circle"
        :disabled="cargando"
        :class="{ 'tasa-actualizando': cargando }"
      >
        <span v-if="cargando" class="spinner-border spinner-border-sm"></span>
        <i v-else class="bi bi-arrow-clockwise"></i>
      </button>
    </div>
    
    <div class="medalla-body bg-white">
      <div class="mb-2">
        <div class="d-flex align-items-center mb-1">
          <span class="text-muted small">Dólar (USD)</span>
          <span v-if="cambioPorcentaje !== 0" 
                class="tasa-variacion ms-2"
                :class="cambioPorcentaje > 0 ? 'text-success' : 'text-danger'">
            <i :class="cambioPorcentaje > 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
            {{ Math.abs(cambioPorcentaje).toFixed(2) }}%
          </span>
        </div>
        <div class="tasa-valor">Bs. {{ formattedUSD }}</div>
      </div>
      
      <div class="d-flex justify-content-between align-items-center mt-3">
        <div>
          <small class="text-muted d-block">Actualizado:</small>
          <small class="tasa-fecha">{{ fecha }}</small>
        </div>
        <div class="text-end">
          <small class="text-muted d-block">Euro (EUR):</small>
          <small class="fw-medium">Bs. {{ formattedEUR }}</small>
        </div>
      </div>
      
      <div class="progress mt-3" style="height: 3px;">
        <div class="progress-bar bg-warning" 
             :style="{ width: progresoActualizacion + '%' }"
             role="progressbar"></div>
      </div>
      <small class="text-muted d-block mt-1 text-center">
        Actualiza en {{ minutosRestantes }}:{{ segundosRestantes }}
      </small>
    </div>
  </div>
</template>

<script setup>
import { useTasaCambio } from '../composables/useTasaCambio';

const { 
  formattedUSD, 
  formattedEUR, 
  fecha, 
  cambioPorcentaje, 
  cargando, 
  actualizarTasa, 
  minutosRestantes, 
  segundosRestantes, 
  progresoActualizacion 
} = useTasaCambio();
</script>