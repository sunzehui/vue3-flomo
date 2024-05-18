<script lang="ts" setup>
import { computed, ref, toRefs } from 'vue'
import {
  ElDrawer,
} from 'element-plus'
import LeftPanel from '@/components/layouts/sidebar/index.vue'
import { useLayoutStore } from '@/store/layout'

const { isLeftMenuOpen, isDrawerOpen, isPC } = toRefs(useLayoutStore())
const isLeftPanelShow = computed(() => isPC.value && isLeftMenuOpen.value)
</script>

<template>
  <div class="wrapper">
    <LeftPanel class="left-panel" :class="{hide: !isLeftPanelShow }" />

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

  // @apply w-full sm:w-10/12 lg:w-9/12 xl:w-8/12 2xl:w-7/12;
  width: min-content;
  max-width: 100%;
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
.left-panel{
  transition: all .8s ease;
  transform: translateX(0);
  @media screen and (max-width: 1000px) {
    padding: 0 20px;
  }
}
.hide {
  // transition: all 0.8s ease;
  transform: translateX(-100vw);
  transition: all 0.5s ease;
  position: fixed;
}
</style>
