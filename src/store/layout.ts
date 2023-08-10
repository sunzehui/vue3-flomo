import { useMediaQuery } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  const isLeftMenuOpen = ref(false)

  const isPC = useMediaQuery('(min-width: 650px)')

  function setLeftMenuOpen(isOpen = false) {
    isLeftMenuOpen.value = isOpen
  }
  return {
    isLeftMenuOpen,
    setLeftMenuOpen,
    isPC,
  }
})
