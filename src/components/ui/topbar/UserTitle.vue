<script lang="ts" setup>
import { toRefs } from 'vue'
import { RouterLink } from 'vue-router'
import { useLayoutStore } from '@/store/layout'
const props = defineProps<{
  nickname: string
  isPro: boolean
}>()
const { nickname, isPro } = toRefs(props)

const { toggleLeftMenuOpen } = useLayoutStore()
</script>

<template>
  <div class="user">
    <RouterLink class="username" to="/me" @click="toggleLeftMenuOpen(false)">
      <span class="title">{{ nickname }}</span><span class="pro" :class="{ active: isPro }">PRO</span>
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
.user {
  @apply flex py-3 items-center;
  .username {
    font-size: 18px;
    @apply text-secondary-text dark:text-dark-secondary-text font-bold cursor-pointer flex items-center flex-1;
    .title {
      max-width: 120px;
      overflow: hidden;
    }
    .pro {
      @apply bg-regular-text text-white dark:bg-dark-regular-text mx-1 cursor-pointer;
      font-size: 12px;
      padding: 2px 4px;
      border-radius: 4px;
      cursor: pointer;
      &.active {
        // background: #212f4b;
        @apply bg-black-fill dark:bg-dark-black-fill;
      }
    }
  }
  .icons {
    @apply flex items-center gap-2;
  }
  .notify,
  .setting {
    cursor: pointer;
  }
}
</style>
