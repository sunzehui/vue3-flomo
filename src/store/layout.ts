import { useMediaQuery } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref, unref, watchEffect } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  const isLeftMenuOpen = ref(true)
  const isDrawerOpen = ref(false)

  const isPC = useMediaQuery('(min-width: 650px)')

  function toggleLeftMenuOpen(isOpen = false) {
    isLeftMenuOpen.value = isOpen
    console.log("🚀 ~ file: layout.ts:13 ~ toggleLeftMenuOpen ~ isLeftMenuOpen:", isLeftMenuOpen.value)
  }
  function toggleDrawerOpen(isOpen = false) {
    isDrawerOpen.value = isOpen
  }
  watchEffect(() => {
    if (!unref(isPC))
      isLeftMenuOpen.value = false
  })
  return {
    isLeftMenuOpen,
    toggleLeftMenuOpen,
    toggleDrawerOpen,
    isPC,
    isDrawerOpen,
  }
})
