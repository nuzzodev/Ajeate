import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { alerts } from '@/utils/alerts'

export function useAdminLayout() {
  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()

  // Definición centralizada de la navegación
  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2', exact: true },
    { path: '/admin/clientes', label: 'Clientes', icon: 'bi-people' },
    { path: '/admin/pedidos', label: 'Pedidos', icon: 'bi-clipboard-check' },
    { path: '/admin/combos', label: 'Combos', icon: 'bi-box-seam' },
    { path: '/admin/sabores', label: 'Sabores', icon: 'bi-egg-fried' },
    { path: '/admin/lotes', label: 'Lotes', icon: 'bi-boxes' },
    { path: '/admin/bandejas', label: 'Bandejas', icon: 'bi-inboxes' },
    { path: '/admin/materias_primas', label: 'Materias Primas', icon: 'bi-receipt' }
  ]

  const currentPageTitle = computed(() => {
    const current = menuItems.find(item => 
      item.exact ? route.path === item.path : route.path.includes(item.path)
    )
    return current ? current.label : 'Administración'
  })

  const toggleSidebar = () => {
    const element = document.getElementById('sidebarOffcanvas')
    if (element && window.bootstrap) {
      const instance = window.bootstrap.Offcanvas.getOrCreateInstance(element)
      element.classList.contains('show') ? instance.hide() : instance.show()
    }
  }

  const navigateAndClose = (path) => {
    const element = document.getElementById('sidebarOffcanvas')
    if (element && window.bootstrap) {
      const instance = window.bootstrap.Offcanvas.getInstance(element)
      if (instance) instance.hide()
    }
    router.push(path)
  }

  const handleLogout = async () => {
    const result = await alerts.confirm('¿Cerrar sesión?', 'Deberás ingresar tus credenciales nuevamente.')
    if (result.isConfirmed) {
      authStore.logout()
      router.replace('/login').then(() => alerts.success('Sesión cerrada'))
    }
  }

  return {
    menuItems,
    currentPageTitle,
    handleLogout,
    toggleSidebar,
    navigateAndClose,
    currentPath: computed(() => route.path)
  }
}