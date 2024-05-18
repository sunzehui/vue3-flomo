<script lang="ts" setup>
import { computed, toRefs } from 'vue'
import { RouterLink } from 'vue-router'
import { DArrowLeft } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/store/layout'

const props = defineProps<{
  nickname: string
  isPro: boolean
}>()
const { nickname, isPro } = toRefs(props)

const { toggleLeftMenuOpen } = useLayoutStore()
const { isPC } = toRefs(useLayoutStore())
const handleToggleClick = () => {
  toggleLeftMenuOpen(false)
}
const isShowToggleBtn = computed(() => {
  return isPC.value
})
</script>

<template>
  <div class="title-container">
    <div class="user">
      <RouterLink class="username" to="/me">
        <span class="title">{{ nickname }}</span><span class="pro" :class="{ active: isPro }">PRO</span>
      </RouterLink>
    </div>

    <div v-if="isShowToggleBtn" class="sidebar-toggle" @click="handleToggleClick">
      <DArrowLeft class="h-4 w-4" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.title-container {
  @apply flex justify-between items-center my-3;
}

.user {
  @apply flex items-center p-1 duration-150 transition rounded-md;

  &:hover {
    @apply bg-dark-fill-2 text-regular-text;
  }

  .username {
    font-size: 18px;
    @apply text-secondary-text font-bold cursor-pointer flex items-center flex-1;

    .title {
      max-width: 120px;
      overflow: hidden;
    }

    .pro {
      @apply bg-regular-text text-white mx-1 cursor-pointer;
      font-size: 12px;
      padding: 2px 4px;
      border-radius: 4px;
      cursor: pointer;

      &.active {
        // background: #212f4b;
        @apply bg-dark-fill-1;
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

.sidebar-toggle {
  @apply h-full flex items-center justify-center p-2 opacity-0 hover:opacity-100 duration-150 rounded-md;

  &:hover {
    @apply bg-dark-fill-2;
  }
}

.left:hover .sidebar-toggle {
  @apply opacity-100;
}
</style>
