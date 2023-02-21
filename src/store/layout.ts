import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  const isLeftMenuOpen = ref(false)

  function setLeftMenuOpen(isOpen = false) {
    isLeftMenuOpen.value = isOpen
  }
  return {
    isLeftMenuOpen,
    setLeftMenuOpen,
  }
})
