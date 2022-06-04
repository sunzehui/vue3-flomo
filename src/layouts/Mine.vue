<script lang="ts" setup>
import LeftPanel from "@/components/LeftPanel.vue";
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
