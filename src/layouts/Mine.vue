<script lang="ts" setup>
import LeftPanel from '@/components/left-panel/index.vue'
</script>

<template>
  <div class="wrapper">
    <LeftPanel />
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
</style>
