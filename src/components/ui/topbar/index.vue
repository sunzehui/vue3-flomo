<script lang="ts" setup>
import { toRefs } from 'vue'
import { useLayoutStore } from '@/store/layout'

const props = defineProps<{
  title: string
}>()
const { toggleLeftMenuOpen } = useLayoutStore()

const { isPC } = toRefs(useLayoutStore())
</script>

<template>
  <nav>
    <div class="title-wrp">
      <span v-show="!isPC" class="showLeftPanelBtn" @click.stop="toggleLeftMenuOpen(true)">三</span>
      <span class="title hover-bg">
        {{ title || 'MEMO' }}
      </span>
      <slot name="sub-title" />
      <slot name="tool" />
    </div>

    <slot name="right" />
  </nav>
</template>

<style lang="scss" scoped>
.title-wrp{
  flex-shrink: 0;
  @apply flex items-center;
  .hover-bg {
    @apply rounded-md duration-300 transition-colors;
    &:hover {
      background: rgba(55, 53, 47, 0.08);
    }
  }
 > span.title {
    font-size: 18px;
    color: #5f5f5f;
    @apply relative px-2 cursor-pointer flex-shrink-0 font-bold flex-1;
  }
}
.showLeftPanelBtn{
  @apply text-gray-500 text-base mr-2 cursor-pointer;
}
nav {
  display: flex;
  @apply py-3 px-5;
  justify-content: space-between;
  height: 60px;
}
</style>
