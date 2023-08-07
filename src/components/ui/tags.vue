<script lang="ts" setup>
import type { Article } from '@/types/article'

const props = defineProps<{
  tags: Article['tags']
}>()
const emit = defineEmits(['tagClick'])
</script>

<template>
  <ul class="tag-view">
    <li
      v-for="item of props.tags"
      :key="item.content"
      @click.prevent="emit('tagClick', item.content)"
    >
      #{{ item.content }}
    </li>
  </ul>
</template>

<style lang="scss" scoped>
    .tag-view {
      display: flex;
    }

    .tag-view > li {
      @apply mx-1 inline-block h-full cursor-pointer;
      color: #5783f7;
      background-color: #eef3fe;
      padding: 4px;
      font-size: 12px;
      border-radius: 3px;

      &:hover {
        color: #eef3fe;
        background-color: #5783f7;
      }
    }
</style>
