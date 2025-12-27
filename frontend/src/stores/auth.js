import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  
  // Usuarios de ejemplo (en producción esto vendría de una API)
  const users = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador' },
    { username: 'empleado', password: 'empleado123', role: 'empleado', name: 'Empleado' }
  ]
  
  function login(username, password) {
    const foundUser = users.find(u => 
      u.username === username && u.password === password
    )
    
    if (foundUser) {
      user.value = foundUser
      localStorage.setItem('auth_user', JSON.stringify(foundUser))
      return { success: true, user: foundUser }
    }
    
    return { success: false, message: 'Credenciales incorrectas' }
  }
  
  function logout() {
    user.value = null
    localStorage.removeItem('auth_user')
  }
  
  function initialize() {
    const savedUser = localStorage.getItem('auth_user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }
  
  return {
    user,
    isAuthenticated,
    login,
    logout,
    initialize
  }
})