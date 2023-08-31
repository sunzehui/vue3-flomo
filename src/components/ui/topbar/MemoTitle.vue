<script lang="ts" setup>
import { toRefs } from 'vue'
import { useLayoutStore } from '@/store/layout'
const { setLeftMenuOpen } = useLayoutStore()

const { isPC } = toRefs(useLayoutStore())
</script>

<template>
  <div class="title-wrp">
    <span v-show="!isPC" class="showLeftPanelBtn" @click.stop="setLeftMenuOpen(true)">三</span>
    <span class="title hover-bg">
      <slot name="title">
        MEMO
      </slot>
    </span>
    <slot name="sub-title" />
    <slot name="tool" />
  </div>
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
</style>
