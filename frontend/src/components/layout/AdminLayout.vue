<template>
  <div class="admin-layout">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container-fluid">
        <!-- Botón del sidebar móvil - Bootstrap lo maneja automáticamente -->
        <button class="navbar-toggler me-2 d-lg-none" type="button" @click="toggleSidebar">
          <span class="navbar-toggler-icon"></span>
        </button>

        <router-link to="/admin/dashboard" class="navbar-brand">
          <i class="bi bi-speedometer2 me-2 text-warning"></i>
          <span class="text-warning fw-bold">Admin</span> Panel
        </router-link>

        <!-- Dropdown del usuario - Bootstrap lo maneja automáticamente -->
        <div class="dropdown ms-auto">
          <button class="btn btn-outline-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown"
            aria-expanded="false">
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
              <li class="nav-item">
                <router-link to="/admin/materias_primas" class="nav-link d-flex align-items-center"
                  :class="{ 'active': $route.path.includes('/materias_primas') }">
                  <i class="bi bi-receipt me-2"></i>Materias Primas
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
    <div class="offcanvas offcanvas-start d-lg-none" tabindex="-1" id="sidebarOffcanvas"
      aria-labelledby="sidebarOffcanvasLabel">
      <div class="offcanvas-header bg-dark text-white">
        <h5 class="offcanvas-title fw-bold" id="sidebarOffcanvasLabel">
          <i class="bi bi-speedometer2 me-2 text-warning"></i>Menú Admin
        </h5>
        <button type="button" class="btn-close btn-close-white" @click="toggleSidebar" aria-label="Close"></button>
      </div>

      <div class="offcanvas-body p-0 bg-light">
        <ul class="nav flex-column nav-pills mt-2">
          <li class="nav-item border-bottom border-white">
            <a href="#" @click.prevent="navigateAndClose('/admin/dashboard')"
              class="nav-link px-4 py-3 d-flex align-items-center"
              :class="{ 'active bg-warning text-dark fw-bold': $route.path === '/admin/dashboard' }">
              <i class="bi bi-speedometer2 me-3 fs-5"></i> Dashboard
            </a>
          </li>

          <li class="nav-item border-bottom border-white">
            <a href="#" @click.prevent="navigateAndClose('/admin/clientes')"
              class="nav-link px-4 py-3 d-flex align-items-center"
              :class="{ 'active bg-warning text-dark fw-bold': $route.path.includes('/clientes') }">
              <i class="bi bi-people me-3 fs-5"></i> Clientes
            </a>
          </li>

          <li class="nav-item border-bottom border-white">
            <a href="#" @click.prevent="navigateAndClose('/admin/pedidos')"
              class="nav-link px-4 py-3 d-flex align-items-center"
              :class="{ 'active bg-warning text-dark fw-bold': $route.path.includes('/pedidos') }">
              <i class="bi bi-clipboard-check me-3 fs-5"></i> Pedidos
            </a>
          </li>

          <li class="nav-item border-bottom border-white">
            <a href="#" @click.prevent="navigateAndClose('/admin/combos')"
              class="nav-link px-4 py-3 d-flex align-items-center"
              :class="{ 'active bg-warning text-dark fw-bold': $route.path.includes('/combos') }">
              <i class="bi bi-box-seam me-3 fs-5"></i> Combos
            </a>
          </li>

          <li class="nav-item border-bottom border-white">
            <a href="#" @click.prevent="navigateAndClose('/admin/sabores')"
              class="nav-link px-4 py-3 d-flex align-items-center"
              :class="{ 'active bg-warning text-dark fw-bold': $route.path.includes('/sabores') }">
              <i class="bi bi-egg-fried me-3 fs-5"></i> Sabores
            </a>
          </li>

          <li class="nav-item border-bottom border-white">
            <a href="#" @click.prevent="navigateAndClose('/admin/lotes')"
              class="nav-link px-4 py-3 d-flex align-items-center"
              :class="{ 'active bg-warning text-dark fw-bold': $route.path.includes('/lotes') }">
              <i class="bi bi-boxes me-3 fs-5"></i> Lotes
            </a>
          </li>

          <li class="nav-item border-bottom border-white">
            <a href="#" @click.prevent="navigateAndClose('/admin/bandejas')"
              class="nav-link px-4 py-3 d-flex align-items-center"
              :class="{ 'active bg-warning text-dark fw-bold': $route.path.includes('/bandejas') }">
              <i class="bi bi-tray me-3 fs-5"></i> Bandejas
            </a>
          </li>

          <li class="nav-item border-bottom border-white">
            <a href="#" @click.prevent="navigateAndClose('/admin/materias_primas')"
              class="nav-link px-4 py-3 d-flex align-items-center"
              :class="{ 'active bg-warning text-dark fw-bold': $route.path.includes('/materias_primas') }">
              <i class="bi bi-receipt me-3 fs-5"></i> Materias Primas
            </a>
          </li>

          <li class="nav-item mt-4 px-4 pb-4">
            <a href="#" @click.prevent="navigateAndClose('/')" class="btn btn-outline-dark w-100 fw-bold">
              <i class="bi bi-house me-2"></i> Ir al Sitio Web
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../../stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { computed, onMounted } from 'vue' // Añadimos onMounted
import { Offcanvas } from 'bootstrap'

export default {
  name: 'AdminLayout',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const route = useRoute()

    const toggleSidebar = () => {
      const element = document.getElementById('sidebarOffcanvas')
      if (element) {
        const bsOffcanvas = Offcanvas.getOrCreateInstance(element)

        // Si el menú ya está abierto, lo ocultamos (esto limpia el backdrop)
        if (element.classList.contains('show')) {
          bsOffcanvas.hide()
        } else {
          bsOffcanvas.show()
        }
      }
    }
    const navigateAndClose = (path) => {
      // Primero cerramos el menú
      const element = document.getElementById('sidebarOffcanvas')
      if (element) {
        const instance = Offcanvas.getInstance(element)
        if (instance) instance.hide()
      }
      // Luego navegamos
      router.push(path)
    }

    const pageTitles = {
      '/admin/dashboard': 'Dashboard',
      '/admin/clientes': 'Clientes',
      '/admin/pedidos': 'Pedidos',
      '/admin/combos': 'Combos',
      '/admin/sabores': 'Sabores',
      '/admin/lotes': 'Lotes',
      '/admin/bandejas': 'Bandejas',
      '/admin/materias_primas': 'Materias Primas'
    }

    const currentPageTitle = computed(() => {
      return pageTitles[route.path] || 'Administración'
    })

    const logout = () => {
      authStore.logout()
      router.replace('/login')
    }

    // ¡IMPORTANTE!: Debes retornar toggleSidebar para que el template lo use
    return {
      authStore,
      currentPageTitle,
      logout,
      toggleSidebar,
      navigateAndClose
    }
  }
}
</script>