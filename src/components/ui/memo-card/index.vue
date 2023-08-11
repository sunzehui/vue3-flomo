<script lang="ts" setup>
import {
  computed,
  toRefs,
  unref,
} from 'vue'
import { Pin } from '@icon-park/vue-next'
import { useRouter } from 'vue-router'
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import TextClamp from 'vue3-text-clamp'
import { useEventBus } from '@vueuse/core'
import MemoAction from './action.vue'
import Tags from '@/components/ui/tags.vue'
import Gallery from '@/components/ui/memo-card/gallery.vue'

import type { Article } from '@/types/article'
import 'dayjs/locale/zh-cn'
import { formatDate } from '@/utils/time'
import { useUserStore } from '@/store/user'

import { MEMO_CARD } from '@/common/event-bus'

const props = defineProps<{
  article: Article
}>()

dayjs.locale('zh-cn')

dayjs.extend(duration)
dayjs.extend(relativeTime)

const router = useRouter()
const tagClick = (tag) => {
  router.push({
    name: 'memo',
    query: {
      tag,
    },
  })
}
const { article } = toRefs(props)

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
  busEmit({ action: 'open-detail-card' }, props.article)
}
</script>

<template>
  <div class="card">
    <div class="header relative">
      <span class="time-text cursor-pointer" @click="showDetail">{{ updateTime }}</span>
      <MemoAction
        v-if="isLogin"
        :article="article"
      />
      <Pin
        v-show="article.is_topic"
        class="absolute -right-6 -top-4"
        theme="outline"
        size="24"
        fill="#333"
      />
    </div>
    <TextClamp
      class="content"
      :text="article.content"
      :max-height="100"
    />
    <Gallery
      v-if="article.images.length"
      :images="article.images"
    />
    <div class="footer">
      <Tags :tags="article.tags" @tagClick="tagClick" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  @apply bg-white px-5 py-2 duration-300 mt-2 rounded-md;
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
  }

  .more ul {
    visibility: hidden;
  }

  .footer {
    margin-top: 10px;

  }
}
</style>
