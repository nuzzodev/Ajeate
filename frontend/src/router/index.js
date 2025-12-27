import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rutas públicas
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    
    // Rutas protegidas (admin)
    {
      path: '/admin',
      component: () => import('../components/layout/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue')
        },
        {
          path: 'clientes',
          name: 'admin-clientes',
          component: () => import('../views/ClientesView.vue')
        },
        {
          path: 'pedidos',
          name: 'admin-pedidos',
          component: () => import('../views/PedidosView.vue')
        },
        {
          path: 'combos',
          name: 'admin-combos',
          component: () => import('../views/CombosView.vue')
        },
        {
          path: 'sabores',
          name: 'admin-sabores',
          component: () => import('../views/SaboresView.vue')
        },
        {
          path: 'lotes',
          name: 'admin-lotes',
          component: () => import('../views/LotesView.vue')
        },
        {
          path: 'bandejas',
          name: 'admin-bandejas',
          component: () => import('../views/BandejasView.vue')
        }
      ]
    }
  ]
})

// Guardia de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Inicializar autenticación
  authStore.initialize()
  
  // Si la ruta requiere autenticación y no está autenticado
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } 
  // Si la ruta requiere ser invitado y ya está autenticado
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/admin/dashboard')
  } 
  // Permitir acceso
  else {
    next()
  }
})

export default router