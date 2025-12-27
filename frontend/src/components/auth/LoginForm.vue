<template>
  <div class="card shadow-sm border-0">
    <div class="card-body p-4">
      <div class="text-center mb-4">
        <i class="bi bi-shield-lock display-4 text-warning"></i>
        <h3 class="mt-3">Acceso Administrativo</h3>
        <p class="text-muted">Ingresa tus credenciales</p>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="username" class="form-label">Usuario</label>
          <input 
            type="text" 
            class="form-control" 
            id="username"
            v-model="form.username"
            required
            placeholder="Ingresa tu usuario">
        </div>
        
        <div class="mb-4">
          <label for="password" class="form-label">Contraseña</label>
          <input 
            type="password" 
            class="form-control" 
            id="password"
            v-model="form.password"
            required
            placeholder="Ingresa tu contraseña">
        </div>
        
        <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
          {{ error }}
          <button type="button" class="btn-close" @click="error = ''"></button>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-warning w-100 py-2"
          :disabled="loading">
          <span v-if="loading">
            <span class="spinner-border spinner-border-sm me-2"></span>
            Verificando...
          </span>
          <span v-else>
            <i class="bi bi-box-arrow-in-right me-2"></i>Iniciar Sesión
          </span>
        </button>
      </form>
      
      <hr class="my-4">
      
      <div class="text-center">
        <small class="text-muted">Credenciales de prueba:</small>
        <div class="mt-2">
          <span class="badge bg-info me-2">admin / admin123</span>
          <span class="badge bg-secondary">empleado / empleado123</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../../stores/auth'

export default {
  name: 'LoginForm',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      error: '',
      loading: false
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      this.error = ''
      
      const authStore = useAuthStore()
      const result = authStore.login(this.form.username, this.form.password)
      
      setTimeout(() => {
        this.loading = false
        
        if (result.success) {
          this.$router.push('/admin/dashboard')
        } else {
          this.error = result.message
        }
      }, 500) // Simula tiempo de red
    }
  }
}
</script>