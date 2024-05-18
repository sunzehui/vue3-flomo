<script setup lang="ts">
import SideBarItem from './page-item.vue'
import { router } from '@/routes'

const subpages= router.getRoutes().filter((item) => item.meta.category =='subpage')
</script>

<template>
  <div class="bar-list">
    <SideBarItem v-for="item in subpages" :key="item.path" :to="item.path">
      <template #icon>
        <Component :is="item.meta.icon" />
      </template>
      {{ item.meta.title }}
    </SideBarItem>
  </div>
</template>

<style scoped>
.bar-list {
  margin: 8px 0 18px;
  color: #9d9d9d;
}
</style>
