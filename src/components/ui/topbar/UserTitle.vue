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
    font-weight: bold;
    font-size: 18px;
    color: #5f5f5f;
    @apply cursor-pointer flex items-center flex-1;
    .title {
      max-width: 120px;
      overflow: hidden;
    }
    .pro {
      color: white;
      background: #9d9d9d;
      font-size: 12px;
      padding: 2px 4px;
      border-radius: 4px;

      cursor: pointer;
      @apply mx-1;
      &.active {
        background: #212f4b;
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
