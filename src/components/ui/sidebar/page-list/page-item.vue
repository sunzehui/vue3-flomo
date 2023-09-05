<script lang="ts" setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useLayoutStore } from '@/store/layout'

const props = defineProps<{
  to: string
}>()
const route = useRoute()
const itemActive = computed(() => route.path === props.to ? 'active' : '')
const { toggleLeftMenuOpen } = useLayoutStore()
const clickedPath = () => {
  toggleLeftMenuOpen(false)
}
</script>

<template>
  <RouterLink :to="props.to" @click="clickedPath">
    <div class="item" :class="itemActive">
      <i class="icon">
        <slot name="icon" />
      </i>
      <slot>MEMO</slot>
    </div>
  </RouterLink>
</template>

<style scoped lang="scss">
.item {
  @apply flex items-center cursor-pointer text-sm py-2 pl-2 rounded-md;
  border-radius: 5px;
  .icon {
    @apply mr-2 inline-block;
    width: 1em;
  }

  &:hover {
    @apply bg-base-fill text-regular-text;
    @apply dark:bg-dark-base-fill dark:text-dark-regular-text;
  }

  &.active {
    @apply bg-primary text-primary-text dark:bg-dark-primary dark:text-dark-primary-text;
  }
}
</style>
