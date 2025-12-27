<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <!-- Solo mostrar Header si no estamos en login/admin -->
    <Header v-if="!isAdminRoute" />
    
    <main class="flex-grow-1">
      <router-view v-slot="{ Component }">
        <!-- Forzar recreación del componente al cambiar ruta -->
        <component :is="Component" :key="$route.fullPath" />
      </router-view>
    </main>
    
    <!-- Solo mostrar Footer si no estamos en login/admin -->
    <Footer v-if="!isAdminRoute" />
  </div>
</template>

<script>
import Header from './components/layout/header.vue'
import Footer from './components/layout/Footer.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  setup() {
    const route = useRoute()
    
    const isAdminRoute = computed(() => {
      return route.path.includes('/admin') || route.path === '/login'
    })
    
    return {
      isAdminRoute
    }
  }
}
</script>

<style>
/* Evitar scroll horizontal */
html, body {
  overflow-x: hidden;
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>