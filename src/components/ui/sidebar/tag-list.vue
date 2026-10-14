<script lang="ts" setup>
import { computed, ref } from 'vue'
import Tag from '@/components/ui/sidebar/tag.vue'
import { useMemoStore } from '@/store/memo'
import type { tagType } from '@/types/memo'

const articleStore = useMemoStore()
const topicTag = computed(() =>
  articleStore.tagList.filter(item => item.is_topics),
)
/** 非置顶标签 */
const normalTags = computed(() =>
  articleStore.tagList.filter(item => !item.is_topics),
)

/** 整理模式：展示层级调整入口 */
const treeMode = ref(false)

/**
 * 把标签按 parentId 展开成带层级的扁平列表（DFS）。
 * - parentId 指向不存在的标签时按顶层处理
 * - 用 visited 兜住潜在的环，避免无限递归
 */
const flatTagList = computed<Array<{ tag: tagType, depth: number }>>(() => {
  const list = normalTags.value
  const idSet = new Set(list.map(item => String(item.id)))
  const childrenMap = new Map<string, tagType[]>()

  for (const tag of list) {
    const key = tag.parentId && idSet.has(String(tag.parentId))
      ? String(tag.parentId)
      : '__root__'
    const bucket = childrenMap.get(key) ?? []
    bucket.push(tag)
    childrenMap.set(key, bucket)
  }
  for (const bucket of childrenMap.values())
    bucket.sort((a, b) => a.content.localeCompare(b.content))

  const result: Array<{ tag: tagType, depth: number }> = []
  const visited = new Set<string>()
  const walk = (key: string, depth: number) => {
    for (const tag of childrenMap.get(key) ?? []) {
      const tid = String(tag.id)
      if (visited.has(tid))
        continue
      visited.add(tid)
      result.push({ tag, depth })
      walk(tid, depth + 1)
    }
  }
  walk('__root__', 0)
  return result
})

/** 可选父标签：排除自身 */
function candidatesOf(tag: tagType) {
  return normalTags.value
    .filter(item => String(item.id) !== String(tag.id))
    .map(item => ({ id: item.id, content: item.content }))
}
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
    <div class="tag-title-row">
      <h4 class="tag-title">
        全部标签
      </h4>
      <span
        v-if="normalTags.length"
        class="organize-toggle"
        @click="treeMode = !treeMode"
      >
        {{ treeMode ? '完成' : '整理' }}
      </span>
    </div>
    <div class="tag-list">
      <Tag
        v-for="item in flatTagList"
        :key="item.tag.id"
        :link="item.tag.content"
        :is-topic="item.tag.is_topics"
        :depth="item.depth"
        :nestable="treeMode"
        :parent-id="item.tag.parentId ?? null"
        :parent-candidates="treeMode ? candidatesOf(item.tag) : []"
      >
        {{
          item.tag.content
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
  margin: 0;
}

.tag-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0 0;
}

.organize-toggle {
  @apply text-xs cursor-pointer text-regular-text;
  font-size: 12px;
  user-select: none;

  &:hover {
    @apply text-primary;
  }
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
