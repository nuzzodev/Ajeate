<template>
  <div class="login-page min-vh-100 d-flex align-items-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="mb-5 text-center">
            <h1 class="display-5 fw-bold text-dark">
              <span class="text-warning">Ajeate</span> EN EL SABOR
            </h1>
            <p class="lead">Sistema de Gestión Administrativa</p>
          </div>
          
          <LoginForm />
          
          <div class="text-center mt-4">
            <router-link to="/" class="text-decoration-none">
              <i class="bi bi-arrow-left me-1"></i>Volver al inicio
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '../components/auth/LoginForm.vue'
import { useAuthStore } from '../stores/auth'  // ← IMPORTAR AQUÍ

export default {
  name: 'LoginView',
  components: {
    LoginForm
  },
  mounted() {
    // Si ya está autenticado, redirige al dashboard
    const authStore = useAuthStore()  // ← Ahora está definido
    if (authStore.isAuthenticated) {
      this.$router.push('/admin/dashboard')
    }
  }
}
</script>

