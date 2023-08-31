<script lang="ts" setup>
import MemoTitle from '@/components/ui/topbar/MemoTitle.vue'
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <nav>
    <MemoTitle>
      <template #title>
        {{ props.title }}
      </template>
      <template #tool>
        <slot name="left" />
      </template>
      <template #sub-title? />
    </MemoTitle>
    <slot name="right" />
  </nav>
</template>

<style lang="scss" scoped>
nav {
  display: flex;
  padding: 0 10px;
  @apply py-3 px-5;

  justify-content: space-between;

  height: 60px;
}
</style>
