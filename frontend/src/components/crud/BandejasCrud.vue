<template>
  <div class="bandejas-container">
    <div v-if="isLoading" class="text-center p-5">
      <div class="spinner-border text-warning" role="status"></div>
    </div>

    <div v-else class="row g-4">
      <div v-for="bandeja in bandejas" :key="bandeja.id_bandeja" class="col-12 col-md-6 col-lg-4">
        <div class="ajeate-card border-0 shadow-sm rounded-4 bg-light overflow-hidden h-100">
          <div class="position-relative">
            <img 
              :src="getImageUrl(bandeja.sabor?.imagen_url)" 
              class="card-img-top" 
              style="height: 180px; object-fit: cover;"
              alt="SABOR IMAGEN"
            >
            <div class="badge-qty position-absolute top-0 end-0 m-3 bg-dark text-warning fw-bold p-2 px-3 rounded-pill shadow">
              {{ bandeja.cantidad_disponible }} UNIDS
            </div>
          </div>

          <div class="p-4 pt-3">
            <div :class="['status-line mb-3', bandeja.cantidad_disponible > 50 ? 'bg-success' : 'bg-warning']"></div>
            <h3 class="fw-bold text-dark h4 mb-0">{{ bandeja.sabor?.nombre }}</h3>
            <div class="text-muted small mb-4">
              <i class="bi bi-calendar3 me-1"></i> {{ formatDate(bandeja.fecha_produccion) }}
            </div>

            <div class="d-flex gap-2">
              <button @click="openEditModal(bandeja)" class="btn btn-dark flex-grow-1 fw-bold rounded-pill shadow-sm">
                <i class="bi bi-pencil-square me-2"></i>Editar
              </button>
              <button @click="confirmDelete(bandeja)" class="btn btn-outline-danger rounded-pill shadow-sm">
                <i class="bi bi-trash3"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalForm 
      modalId="bandejaModal"
      :title="editing ? 'Modificar Tanda' : 'Nueva Producción'"
      :editing="editing"
      @submit="saveBandeja"
    >
      <div class="mb-4">
        <label class="form-label fw-bold small text-muted">SELECCIONAR SABOR</label>
        <select v-model="currentBandeja.sabor_fk" class="form-select border-2 py-3" required>
          <option value="" disabled>Elegir sabor...</option>
          <option v-for="sabor in sabores" :key="sabor.id_sabor" :value="sabor.id_sabor">
            {{ sabor.nombre }}
          </option>
        </select>
      </div>
      </ModalForm>
  </div>
</template>

<script setup>
import { useBandejas } from '../composables/useBandejas';
import ModalForm from '@/components/common/ModalForm.vue';

const { 
  bandejas, sabores, currentBandeja, editing, isLoading,
  formatDate, openCreateModal, openEditModal, saveBandeja, confirmDelete,getImageUrl 
} = useBandejas();

// Exponemos el método para el componente padre (si lo necesita)
defineExpose({ openCreateModal });
</script>