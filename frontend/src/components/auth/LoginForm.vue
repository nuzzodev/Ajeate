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
          <label for="name" class="form-label">Usuario</label>
          <input 
            type="text" 
            class="form-control" 
            v-model="form.name" 
            required
            placeholder="Ingresa tu nombre de usuario">
        </div>
        
        <div class="mb-4">
          <label for="password" class="form-label">Contraseña</label>
          <input 
            type="password" 
            class="form-control" 
            v-model="form.password"
            required
            placeholder="Ingresa tu contraseña">
        </div>
        
        <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
          {{ error }}
          <button type="button" class="btn-close" @click="clearError"></button>
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
    </div>
  </div>
</template>

<script setup>
import { useLoginForm } from '../composables/useLoginForm';

const { form, error, loading, handleSubmit } = useLoginForm();
</script>

