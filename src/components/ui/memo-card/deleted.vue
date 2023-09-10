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
const cardContainerHeight = inject<Ref<number>>('cardContainerHeight') || null
const memoContentMaxHeight = computed(() => {
  if (!cardContainerHeight)
    return '100%'
  // 不能超过1/3屏
  return `${cardContainerHeight.value / 3}px`
})
</script>

<template>
  <div class="card">
    <div class="header relative">
      <span class="time-text cursor-pointer" @click="showDetail">删除于{{ updateTime }}</span>
      <MemoAction
        v-if="isLogin"
        :article="memo"
        is-deleted
      />
    </div>
    <ElScrollbar :max-height="memoContentMaxHeight">
      <div class="content">
        <span v-html="memo.content" />
      </div>
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
  @apply bg-base-fill px-5 py-2 relative duration-300 mt-2 rounded-md;
  &:hover {
    box-shadow: 0 2px 16px #dddddd;
    @apply dark:shadow-none;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1.8em;
    @apply text-regular-text;

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
    @apply text-primary-text;
    font-size: 14px;
    word-break: break-all;
    white-space:pre-wrap;
  }

  .more ul {
    visibility: hidden;
  }

  .footer {
    margin-top: 10px;

  }
}
</style>
