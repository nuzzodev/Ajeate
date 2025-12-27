<template>
  <div class="admin-layout">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container-fluid">
        <!-- Botón del sidebar móvil - Bootstrap lo maneja automáticamente -->
        <button class="navbar-toggler me-2" type="button" data-bs-toggle="offcanvas" 
                data-bs-target="#sidebarOffcanvas" aria-controls="sidebarOffcanvas">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <router-link to="/admin/dashboard" class="navbar-brand">
          <i class="bi bi-speedometer2 me-2 text-warning"></i>
          <span class="text-warning fw-bold">Admin</span> Panel
        </router-link>
        
        <!-- Dropdown del usuario - Bootstrap lo maneja automáticamente -->
        <div class="dropdown ms-auto">
          <button class="btn btn-outline-light btn-sm dropdown-toggle" type="button" 
                  data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person-circle me-1"></i>
            {{ authStore.user?.name }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <button class="dropdown-item" type="button" @click="logout">
                <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar para desktop -->
        <div class="col-lg-2 d-none d-lg-block p-0">
          <div class="sidebar bg-light border-end min-vh-100 p-3">
            <ul class="nav nav-pills flex-column gap-2">
              <li class="nav-item">
                <router-link to="/admin/dashboard" class="nav-link d-flex align-items-center" 
                           :class="{ 'active': $route.path === '/admin/dashboard' }">
                  <i class="bi bi-speedometer2 me-2"></i>Dashboard
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/admin/clientes" class="nav-link d-flex align-items-center"
                           :class="{ 'active': $route.path.includes('/clientes') }">
                  <i class="bi bi-people me-2"></i>Clientes
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/admin/pedidos" class="nav-link d-flex align-items-center"
                           :class="{ 'active': $route.path.includes('/pedidos') }">
                  <i class="bi bi-clipboard-check me-2"></i>Pedidos
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/admin/combos" class="nav-link d-flex align-items-center"
                           :class="{ 'active': $route.path.includes('/combos') }">
                  <i class="bi bi-box-seam me-2"></i>Combos
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/admin/sabores" class="nav-link d-flex align-items-center"
                           :class="{ 'active': $route.path.includes('/sabores') }">
                  <i class="bi bi-egg-fried me-2"></i>Sabores
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/admin/lotes" class="nav-link d-flex align-items-center"
                           :class="{ 'active': $route.path.includes('/lotes') }">
                  <i class="bi bi-boxes me-2"></i>Lotes
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/admin/bandejas" class="nav-link d-flex align-items-center"
                           :class="{ 'active': $route.path.includes('/bandejas') }">
                  <i class="bi bi-tray me-2"></i>Bandejas
                </router-link>
              </li>
            </ul>
            
            <hr class="my-4">
            
            <router-link to="/" class="btn btn-outline-dark w-100">
              <i class="bi bi-house me-1"></i>Ir al Sitio Web
            </router-link>
          </div>
        </div>

        <!-- Contenido Principal -->
        <div class="col-lg-10 p-4">
          <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb bg-light p-3 rounded shadow-sm">
              <li class="breadcrumb-item">
                <router-link to="/admin/dashboard" class="text-decoration-none">
                  <i class="bi bi-house-door me-1"></i>Inicio
                </router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                {{ currentPageTitle }}
              </li>
            </ol>
          </nav>
          
          <router-view :key="$route.fullPath" />
        </div>
      </div>
    </div>

    <!-- Offcanvas para móviles - Bootstrap lo maneja automáticamente -->
    <div class="offcanvas offcanvas-start d-lg-none" tabindex="-1" id="sidebarOffcanvas">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">Menú Administrativo</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body p-0">
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link to="/admin/dashboard" class="nav-link px-4 py-3" 
                       data-bs-dismiss="offcanvas">
              <i class="bi bi-speedometer2 me-2"></i>Dashboard
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/clientes" class="nav-link px-4 py-3"
                       data-bs-dismiss="offcanvas">
              <i class="bi bi-people me-2"></i>Clientes
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/pedidos" class="nav-link px-4 py-3"
                       data-bs-dismiss="offcanvas">
              <i class="bi bi-clipboard-check me-2"></i>Pedidos
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/combos" class="nav-link px-4 py-3"
                       data-bs-dismiss="offcanvas">
              <i class="bi bi-box-seam me-2"></i>Combos
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/sabores" class="nav-link px-4 py-3"
                       data-bs-dismiss="offcanvas">
              <i class="bi bi-egg-fried me-2"></i>Sabores
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/lotes" class="nav-link px-4 py-3"
                       data-bs-dismiss="offcanvas">
              <i class="bi bi-boxes me-2"></i>Lotes
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/bandejas" class="nav-link px-4 py-3"
                       data-bs-dismiss="offcanvas">
              <i class="bi bi-tray me-2"></i>Bandejas
            </router-link>
          </li>
          <li class="nav-item mt-4 px-4">
            <router-link to="/" class="btn btn-outline-dark w-100" data-bs-dismiss="offcanvas">
              <i class="bi bi-house me-1"></i>Ir al Sitio Web
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../../stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

export default {
  name: 'AdminLayout',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const route = useRoute()
    
    const pageTitles = {
      '/admin/dashboard': 'Dashboard',
      '/admin/clientes': 'Clientes',
      '/admin/pedidos': 'Pedidos',
      '/admin/combos': 'Combos',
      '/admin/sabores': 'Sabores',
      '/admin/lotes': 'Lotes',
      '/admin/bandejas': 'Bandejas'
    }
    
    const currentPageTitle = computed(() => {
      return pageTitles[route.path] || 'Administración'
    })
    
    const logout = () => {
      authStore.logout()
      router.replace('/login')
    }
    
    return {
      authStore,
      currentPageTitle,
      logout
    }
  }
}
</script>