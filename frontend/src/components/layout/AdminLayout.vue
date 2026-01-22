<template>
  <div class="admin-layout">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container-fluid">
        <button class="navbar-toggler me-2 d-lg-none" type="button" @click="toggleSidebar">
          <span class="navbar-toggler-icon"></span>
        </button>
        <router-link to="/admin/dashboard" class="navbar-brand">
          <i class="bi bi-speedometer2 me-2 text-warning"></i>
          <span class="text-warning fw-bold">Admin</span> Panel
        </router-link>
        <button class="btn btn-outline-warning btn-sm ms-auto" type="button" @click="handleLogout">
          <i class="bi bi-box-arrow-right me-1"></i> Cerrar Sesión
        </button>
      </div>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-2 d-none d-lg-block p-0">
          <div class="sidebar bg-light border-end min-vh-100 p-3">
            <ul class="nav nav-pills flex-column gap-2">
              <li v-for="item in menuItems" :key="item.path" class="nav-item">
                <router-link :to="item.path" class="nav-link d-flex align-items-center"
                  :class="{ 'active': item.exact ? currentPath === item.path : currentPath.includes(item.path) }">
                  <i :class="['bi', item.icon, 'me-2']"></i> {{ item.label }}
                </router-link>
              </li>
            </ul>
            <hr class="my-4">
            <router-link to="/" class="btn btn-outline-dark w-100">
              <i class="bi bi-house me-1"></i> Ir al Sitio Web
            </router-link>
          </div>
        </div>

        <div class="col-lg-10 p-4">
          <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb bg-light p-3 rounded shadow-sm">
              <li class="breadcrumb-item">
                <router-link to="/admin/dashboard" class="text-decoration-none">
                  <i class="bi bi-house-door me-1"></i>Inicio
                </router-link>
              </li>
              <li class="breadcrumb-item active">{{ currentPageTitle }}</li>
            </ol>
          </nav>
          <router-view :key="currentPath" />
        </div>
      </div>
    </div>

    <div class="offcanvas offcanvas-start d-lg-none" tabindex="-1" id="sidebarOffcanvas">
      <div class="offcanvas-header bg-dark text-white">
        <h5 class="offcanvas-title fw-bold"><i class="bi bi-speedometer2 me-2 text-warning"></i>Menú Admin</h5>
        <button type="button" class="btn-close btn-close-white" @click="toggleSidebar"></button>
      </div>
      <div class="offcanvas-body p-0 bg-light">
        <ul class="nav flex-column nav-pills mt-2">
          <li v-for="item in menuItems" :key="item.path" class="nav-item border-bottom border-white">
            <a href="#" @click.prevent="navigateAndClose(item.path)"
              class="nav-link px-4 py-3 d-flex align-items-center"
              :class="{ 'active bg-warning text-dark fw-bold': item.exact ? currentPath === item.path : currentPath.includes(item.path) }">
              <i :class="['bi', item.icon, 'me-3 fs-5']"></i> {{ item.label }}
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

<script setup>
import { useAdminLayout } from '../composables/useAdminLayout'

const { 
  menuItems,
  currentPageTitle, 
  handleLogout, 
  toggleSidebar, 
  navigateAndClose,
  currentPath 
} = useAdminLayout()
</script>