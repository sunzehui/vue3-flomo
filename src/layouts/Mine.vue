<script lang="ts" setup>
import { computed, toRefs, watchEffect } from 'vue'
import {
  ElDrawer,
  ElMenu,
} from 'element-plus'
import LeftPanel from '@/components/layouts/sidebar/index.vue'
import { useLayoutStore } from '@/store/layout'

const { isLeftMenuOpen, isDrawerOpen, isPC } = toRefs(useLayoutStore())
const isLeftShow = computed(() => isPC.value && isLeftMenuOpen.value)
</script>

<template>
  <div class="wrapper">
    <Transition name="to-right">
      <LeftPanel :class="{ show: isLeftShow, hide: !isLeftShow }" />
    </Transition>

    <ElDrawer
      v-model="isDrawerOpen"
      direction="ltr"
      size="280px"
      :with-header="false"
    >
      <LeftPanel />
    </ElDrawer>

    <main>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :key="$route.name" />
        </keep-alive>
      </router-view>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  @apply h-screen mx-auto flex justify-center;

  @apply w-full sm:w-10/12 lg:w-9/12 xl:w-8/12 2xl:w-7/12;
  i {
    font-style: normal;
  }

  main {
    width: 640px;
  }
}

@media screen and (max-width: 650px) {
  .wrapper main {
    margin-left: 0 !important;
  }
}
.show{
    transition: all 0.5s ease;
    transform: translateX(0);
}
.hide{
  transition: all 0.8s ease;
    transform: translateX(-100vw);
    position: fixed;
    display: none
}
</style>
