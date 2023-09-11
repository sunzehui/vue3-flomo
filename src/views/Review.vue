<script lang="ts" setup>
import TopBar from '@/components/ui/topbar/index.vue'
import PageBody from '@/layouts/page-body.vue'
</script>

<template>
  <div class="memo-view">
    <TopBar title="每日回顾" />
    <PageBody />
  </div>
</template>

<style lang="scss" scoped>
.input-container {
  @apply px-5;
}

.memo-view {
  height: 100%;
}
</style>
