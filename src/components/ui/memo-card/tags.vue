<script lang="ts" setup>
import { watchEffect } from 'vue'
import type { Memo } from '@/types/memo'

const props = defineProps<{
  tags: Memo['tags']
}>()
const emit = defineEmits(['tagClick'])
watchEffect(() => {
  console.log('🚀 ~ file: tags.vue:6 ~ tags:', props.tags)
})
</script>

<template>
  <ul class="tag-view">
    <li v-for="item of props.tags" :key="item.content" @click.prevent="emit('tagClick', item.content)">
      #{{ item.content }}
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.tag-view {
  display: flex;
}

.tag-view>li {
  @apply mx-1 inline-block h-full cursor-pointer text-tag-text bg-tag-fill;
  padding: 4px;
  font-size: 12px;
  border-radius: 3px;

  &:hover {
    @apply text-tag-fill bg-tag-text;
  }
}
</style>
