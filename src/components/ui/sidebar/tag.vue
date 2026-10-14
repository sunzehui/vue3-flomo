<script setup lang="ts">
import { computed, ref, unref, watchEffect } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElMessageBox } from 'element-plus'
import { router } from '@/routes'
import { useMemoStore } from '@/store/memo'
import { useLayoutStore } from '@/store/layout'

interface ParentCandidate {
  id: number | string
  content: string
}

const props = withDefaults(defineProps<{
  link: string
  isTopic: boolean
  /** 标签树中的层级，用于缩进 */
  depth?: number
  /** 是否允许调整父子关系（整理模式） */
  nestable?: boolean
  /** 当前父标签 id */
  parentId?: number | null
  /** 可选父标签（已排除自身） */
  parentCandidates?: ParentCandidate[]
}>(), {
  depth: 0,
  nestable: false,
  parentId: null,
  parentCandidates: () => [],
})

const isClickMe = ref(false)
const route = useRoute()

watchEffect(() => {
  const { tag } = route.query
  isClickMe.value = tag?.toString() === props.link?.toString()
})

const { isPC, toggleDrawerOpen } = useLayoutStore()
const articleStore = useMemoStore()

const indentStyle = computed(() => ({
  paddingLeft: `${8 + (props.depth ?? 0) * 14}px`,
}))

const handleClick = () => {
  const ispc = unref(isPC)
  if (!ispc)
    toggleDrawerOpen(false)

  router.push({
    name: 'memo',
    query: {
      tag: props.link,
    },
  })
}

const setTop = () => {
  const title = props.isTopic ? '取消置顶' : '置顶'
  ElMessageBox.confirm(`确定${title}该标签吗?`, 'Info', {
    lockScroll: false,
  })
    .then(
      () =>
        articleStore
          .setTagTop({ tag: props.link, topic: !props.isTopic }),
    )
    .catch(() => {})
}

/** 调整父子关系：data-parent-id 为空字符串表示移动到顶层 */
const handleNest = (event: Event) => {
  const target = event.target as HTMLElement | null
  const item = target?.closest?.('[data-parent-id]') as HTMLElement | null
  if (!item)
    return
  const raw = item.dataset.parentId
  const nextParentId = raw ? Number(raw) : null
  if (nextParentId === (props.parentId ? Number(props.parentId) : null))
    return
  articleStore.setTagParent(props.link, nextParentId)
}
</script>

<template>
  <div class="tag-wrap" :class="{ active: isClickMe }" @click.prevent="handleClick">
    <span class="tag" :style="indentStyle">
      <svg
        class="sharp-icon"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect opacity="0.01" width="18" height="18" fill="currentColor" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6.153 7.5L5.838 10.5H3V12H5.6805L5.28675 15.75H6.795L7.18875 12H10.1805L9.78675 15.75H11.295L11.6888 12H15V10.5H11.847L12.162 7.5H15V6H12.3195L12.7133 2.25H11.205L10.8113 6H7.8195L8.21325 2.25H6.705L6.31125 6H3V7.5H6.153ZM10.3387 10.5H7.34625L7.66125 7.5H10.6537L10.3387 10.5Z"
          fill="currentColor"
        />
      </svg>
      <label class="cursor-pointer truncate">
        <slot />
      </label>
    </span>
    <!-- 阻止冒泡，避免点击操作区时误跳转到标签筛选页 -->
    <div class="tag-actions" @click.stop>
      <ElDropdown v-if="nestable" class="nest-trigger" trigger="click">
        <span class="nest-icon" title="调整层级">···</span>
        <template #dropdown>
          <ElDropdownMenu @click="handleNest">
            <ElDropdownItem v-if="parentId" data-parent-id="">
              移出父标签
            </ElDropdownItem>
            <ElDropdownItem
              v-for="p in parentCandidates"
              :key="p.id"
              :data-parent-id="String(p.id)"
            >
              归到 #{{ p.content }}
            </ElDropdownItem>
            <ElDropdownItem v-if="!parentId && !parentCandidates.length" disabled>
              暂无可选父标签
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <Download
        class="right-arrow-icon"
        :class="{ rotate: !props.isTopic }"
        style="height: 1em; width: 1em"
        :color="isClickMe ? 'white' : 'gray'"
        @click.prevent="setTop()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tag-wrap{
  @apply relative flex justify-between items-center w-full cursor-pointer;
  border-radius: 5px;
  &:hover {
    @apply bg-dark-fill-2 text-regular-text;
  }
  &.active {
    @apply bg-primary text-light-text;
  }
}
span.tag {
  line-height: 40px;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  user-select: none;
  border-radius: 0.375rem;
  .sharp-icon {
    display: inline-block;
    margin-right: 6px;
    padding-bottom: 0px;
    flex-shrink: 0;
  }
  svg {
    display: inline-block;
  }
  position: relative;
}
.tag-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}
.nest-trigger {
  opacity: 0;
  transition: opacity 0.15s ease;
}
.tag-wrap:hover .nest-trigger {
  opacity: 1;
}
.nest-icon {
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  font-weight: bold;
  @apply text-regular-text;
  &:hover { @apply text-primary-text; }
}
.right-arrow-icon {
  margin-right: 10px;
  cursor: pointer;
  &.rotate {
    transform: rotate(180deg);
  }
}
</style>
