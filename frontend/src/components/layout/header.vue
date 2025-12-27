<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <span class="fw-bold fs-3">Ajeate</span>
          <span class="ms-2 text-warning fs-6">EN EL SABOR</span>
        </router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link active" to="/">Inicio</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#productos">Productos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#ubicacion">Ubicación</a>
            </li>
            
            <li class="nav-item">
              <router-link v-if="!isAuthenticated" to="/login" class="nav-link">
                <i class="bi bi-box-arrow-in-right me-1"></i>Login
              </router-link>
              <router-link v-else to="/admin/dashboard" class="nav-link">
                <i class="bi bi-speedometer2 me-1"></i>Admin
              </router-link>
            </li>
          </ul>
          <a href="#productos" class=" btn btn-outline-warning "><i class="bi bi-basket"></i> Menu</a>
            

        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { useAuthStore } from '../../stores/auth'

export default {
  name: 'header',
  computed: {
    isAuthenticated() {
      const authStore = useAuthStore()
      return authStore.isAuthenticated
    }
  }
}
</script>