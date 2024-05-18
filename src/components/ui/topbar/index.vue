<script lang="ts" setup>
import { toRefs } from 'vue'
import { DArrowRight, Menu } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/store/layout'

const props = defineProps<{
  title: string
}>()
const { toggleLeftMenuOpen } = useLayoutStore()

const { isPC, isLeftMenuOpen, toggleDrawerOpen } = toRefs(useLayoutStore())

</script>

<template>
  <nav>
    <div class="title-wrp">
      <!-- 显示隐藏左侧菜单 -->
      <div v-if="!isLeftMenuOpen" class="sidebar-toggle">
        <!-- PC -->
        <DArrowRight v-if="isPC" class="h-4 w-4" @click.stop="toggleLeftMenuOpen(true)" />
        <!-- 移动端 -->
        <Menu v-show="!isPC" class="h4 w-4 opacity-60 hover:opacity-100" @click.stop="toggleDrawerOpen(true)" />
      </div>
      <!-- 标题 -->
      <span class="title hover-bg">
        {{ title || 'MEMO' }}
      </span>
      <!-- 子标题 -->
      <slot name="sub-title" />
      <!-- 工具栏 -->
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
    @apply text-secondary-text relative px-2 cursor-pointer flex-shrink-0 font-bold flex-1;
  }
}
.showLeftPanelBtn{
  // @apply text-secondary-text text-base cursor-pointer;
}
nav {
  display: flex;
  @apply py-3 px-5;
  justify-content: space-between;
  height: 60px;
}
.sidebar-toggle{
  @apply h-full flex items-center justify-center p-2 rounded-md;
   &:hover {
    @apply bg-dark-fill-2;
  }

}
</style>
