<script lang="ts" setup>
import { computed, unref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useLayoutStore } from '@/store/layout'

const props = defineProps<{
  to: string
}>()
const route = useRoute()
const itemActive = computed(() => route.path === props.to ? 'active' : '')
const { isPC, toggleDrawerOpen } = useLayoutStore()
const clickedPath = () => {
  const ispc = unref(isPC)
  if (!ispc)
    toggleDrawerOpen(false)

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
  @apply flex items-center cursor-pointer text-sm py-2 pl-2 rounded-md duration-150;
  border-radius: 5px;
  .icon {
    @apply mr-2 inline-block;
    width: 1em;
  }

  &:hover {
    @apply bg-dark-fill-2 text-regular-text;
  }

  &.active {
    @apply bg-primary text-light-text ;
  }
}
</style>
