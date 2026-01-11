import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  
  function login(userData) {
    user.value = userData
    localStorage.setItem('auth_user', JSON.stringify(userData))
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