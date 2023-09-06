<script lang="ts" setup>
import { computed } from 'vue'
import Tag from '@/components/ui/sidebar/tag.vue'
import { useMemoStore } from '@/store/memo'

const articleStore = useMemoStore()
const topicTag = computed(() =>
  articleStore.tagList.filter(item => item.is_topics),
)
const tagList = computed(() =>
  articleStore.tagList.filter(item => !item.is_topics),
)
</script>

<template>
  <div v-if="!topicTag.length" class="empty-topic-tag">
    置顶常用标签于此，以便访问。
  </div>
  <div v-if="topicTag.length" class="topic-tag">
    <h4 class="tag-title">
      置顶标签
    </h4>
    <ul class="tag-list">
      <Tag v-for="tag in topicTag" :key="tag.id" class="relative" :link="tag.content" :is-topic="tag.is_topics">
        {{
          tag.content
        }}
      </Tag>
    </ul>
  </div>

  <div class="normal-tag">
    <h4 class="tag-title">
      全部标签
    </h4>
    <div class="tag-list">
      <Tag v-for="tag in tagList" :key="tag.id" :link="tag.content" :is-topic="tag.is_topics">
        {{
          tag.content
        }}
      </Tag>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.empty-topic-tag {
  @apply text-xs my-2 text-left bg-dark-fill-2 text-regular-text rounded-lg py-2 pl-2;
  font-size: 12px;
  margin: 20px 0 0;
}

.tag-title {
  @apply text-xs my-2 text-left text-list-title-text;
  font-size: 12px;
  margin: 20px 0 0;
}

.tag-list {
  @apply text-regular-text ;
  font-size: 14px;
  list-style-type: none;
  -webkit-padding-start: 0;
  padding-inline-start: 0;
  margin: 8px 0 18px;
}

.topic-tag {
  @apply mt-4;
}

.normal-tag {
  @apply mt-4;
}
</style>
