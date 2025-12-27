<template>
  <div class="dashboard">
    <div class="row mb-4">
      <div class="col-12">
        <h2 class="h4 fw-bold">Dashboard Administrativo</h2>
        <p class="text-muted mb-0">
          Bienvenido, {{ authStore.user?.name }}. 
          <span v-if="authStore.user?.role === 'admin'">(Administrador)</span>
          <span v-else>(Empleado)</span>
        </p>
      </div>
    </div>
    
    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <div class="card border-0 shadow-sm bg-primary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title mb-0">Clientes</h6>
                <h3 class="mb-0">15</h3>
              </div>
              <i class="bi bi-people fs-1"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3">
        <div class="card border-0 shadow-sm bg-success text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title mb-0">Pedidos Hoy</h6>
                <h3 class="mb-0">8</h3>
              </div>
              <i class="bi bi-clipboard-check fs-1"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3">
        <div class="card border-0 shadow-sm bg-warning text-dark">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title mb-0">Emapanadas Vendidas</h6>
                <h3 class="mb-0">120</h3>
              </div>
              <i class="bi bi-egg-fried fs-1"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3">
        <div class="card border-0 shadow-sm bg-info text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title mb-0">Bandejas Activas</h6>
                <h3 class="mb-0">6</h3>
              </div>
              <i class="bi bi-tray fs-1"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white">
            <h5 class="mb-0">Acciones Rápidas</h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <router-link to="/admin/clientes" class="card h-100 border text-decoration-none">
                  <div class="card-body text-center">
                    <i class="bi bi-person-plus display-6 text-primary mb-3"></i>
                    <h6>Nuevo Cliente</h6>
                  </div>
                </router-link>
              </div>
              <div class="col-md-4">
                <router-link to="/admin/pedidos" class="card h-100 border text-decoration-none">
                  <div class="card-body text-center">
                    <i class="bi bi-plus-circle display-6 text-success mb-3"></i>
                    <h6>Crear Pedido</h6>
                  </div>
                </router-link>
              </div>
              <div class="col-md-4">
                <router-link to="/admin/bandejas" class="card h-100 border text-decoration-none">
                  <div class="card-body text-center">
                    <i class="bi bi-plus-square display-6 text-warning mb-3"></i>
                    <h6>Nueva Bandeja</h6>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'DashboardView',
  setup() {
    const authStore = useAuthStore()
    
    return {
      authStore
    }
  }
}
</script>