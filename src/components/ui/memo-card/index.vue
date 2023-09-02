<script lang="ts" setup>
import type { Ref } from 'vue'
import { ElScrollbar } from 'element-plus'
import {
  computed,
  inject,
  toRefs,
  unref,
  watchEffect,
} from 'vue'

import { Pin } from '@icon-park/vue-next'
import { useRouter } from 'vue-router'
import { useEventBus } from '@vueuse/core'
import MemoAction from './action.vue'
import Tags from '@/components/ui/memo-card/tags.vue'
import Gallery from '@/components/ui/memo-card/gallery.vue'

import type { Memo } from '@/types/memo'
import { formatDate } from '@/utils/time'
import { useUserStore } from '@/store/user'

import { MEMO_CARD } from '@/common/event-bus'
import { renderMemoContent } from '@/utils/editor'

const props = defineProps<{
  memo: Memo
}>()

const router = useRouter()
const tagClick = (tag) => {
  router.push({
    name: 'memo',
    query: {
      tag,
    },
  })
}
const { memo: article } = toRefs(props)

const updateTime = computed(() => {
  const memo = unref(article)
  if (memo.is_topic)
    return '置顶'
  return formatDate(memo.createTime)
})
const userStore = useUserStore()
const isLogin = computed(() => userStore.isAuthenticated)
const { emit: busEmit } = useEventBus(MEMO_CARD)
const showDetail = () => {
  busEmit({ action: 'open-detail-card' }, props.memo)
}

const cardContainerHeight = inject<Ref<number>>('cardContainerHeight')
const memoContentMaxHeight = computed(() => {
  // 不能超过1/3屏
  return `${cardContainerHeight.value / 3}px`
})
</script>

<template>
  <div class="card scrollable-container">
    <div class="header relative">
      <span class="time-text cursor-pointer" @click="showDetail">{{ updateTime }}</span>
      <MemoAction
        v-if="isLogin"
        :article="memo"
      />
      <Pin
        v-show="memo.is_topic"
        class="absolute -right-6 -top-4"
        theme="outline"
        size="24"
        fill="#333"
      />
    </div>
    <ElScrollbar :max-height="memoContentMaxHeight">
      <div class="content" v-html="renderMemoContent(memo.content)" />
    </ElScrollbar>

    <Gallery
      v-if="memo.images.length"
      :images="memo.images"
    />
    <div class="footer">
      <Tags :tags="memo.tags" @tagClick="tagClick" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  @apply bg-white px-5 py-2 relative duration-300 mt-2 rounded-md;
  &:hover {
    box-shadow: 0 2px 16px #dddddd;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1.8em;
    color: #8f9193;

    svg {
      cursor: pointer;
    }

    .time-text {
      display: inline-block;

      font-size: 0.8em;
      text-decoration: none;
    }

    > .more {
      position: relative;
      height: 1.8em;
      padding: 0 20px;

      &:hover ul {
        visibility: visible;
        opacity: 1;
      }
    }
  }

  .content {
    color: #323232;
    font-size: 14px;
    word-break: break-all;
    white-space:pre-wrap;
    // max-height: v-bind(memoContentMaxHeight);
    // overflow: scroll;
  }

  /* 定制滚动条样式 */
.scrollable-container::-webkit-scrollbar {
  width: 8px; /* 滚动条宽度 */
}

.scrollable-container::-webkit-scrollbar-track {
  background: #f1f1f1; /* 滚动条轨道的背景颜色 */
}

.scrollable-container::-webkit-scrollbar-thumb {
  background: #888; /* 滚动条滑块的背景颜色 */
  border-radius: 4px; /* 滚动条滑块的圆角 */
}

.scrollable-container::-webkit-scrollbar-thumb:hover {
  background: #555; /* 鼠标悬停时滚动条滑块的背景颜色 */
}
  .more ul {
    visibility: hidden;
  }

  .footer {
    margin-top: 10px;

  }
}
</style>
