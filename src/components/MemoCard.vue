<script lang="ts" setup>
import {
  computed,
  toRefs,
  unref,
} from 'vue'
import {
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
} from 'element-plus'
import { Pin } from '@icon-park/vue-next'
import { useRouter } from 'vue-router'
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import { Right as RightIcon } from '@/components/icon'
import { useArticleStore } from '@/store/article'
import type { Article } from '@/types/article'
import { CardType } from '@/types/card-type'
import 'dayjs/locale/zh-cn'
import { formatDate } from '@/utils/time'
const props = defineProps<{
  article: Article
  isLast: Boolean
}>()
const emit = defineEmits(['openPanel', 'openShare', 'edit'])
dayjs.locale('zh-cn')

dayjs.extend(duration)
dayjs.extend(relativeTime)

type acType =
  | 'cancel-top'
  | 'delete'
  | 'edit'
  | 'detail'
  | 'set-top'
  | 'get-link'

const articleStore = useArticleStore()
const reducerAction = (event: Event) => {
  const type = (event.target as HTMLLIElement).dataset.type as acType

  switch (type) {
    case 'delete':
      articleStore.deleteArticle(+props.article.id)
      break
    case 'detail':
      emit('openPanel', props.article.content)
      break
    case 'get-link':
      emit('openShare', props.article)
      break
    case 'cancel-top':
      articleStore.cancelArticleTop(+props.article.id)
      break
    case 'set-top':
      articleStore.setArticleTop(+props.article.id)
      break
    case 'edit':
      articleStore.setArticle(+props.article.id, { type: CardType.editor })
      break
    default:
      break
  }
}
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
</script>

<template>
  <li class="card">
    <div class="header relative">
      <span class="time-text">{{ updateTime }}</span>
      <ElDropdown>
        <span class="el-dropdown-link">
          <RightIcon />
        </span>
        <template #dropdown>
          <ElDropdownMenu @click="reducerAction">
            <ElDropdownItem data-type="get-link">
              分享
            </ElDropdownItem>
            <ElDropdownItem v-if="article.is_topic" data-type="cancel-top">
              取消置顶
            </ElDropdownItem>
            <ElDropdownItem v-if="!article.is_topic" data-type="set-top">
              置顶
            </ElDropdownItem>
            <ElDropdownItem data-type="detail">
              查看详情
            </ElDropdownItem>
            <ElDropdownItem data-type="edit">
              编辑
            </ElDropdownItem>
            <ElDropdownItem data-type="delete">
              删除
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <Pin
        v-show="article.is_topic"
        class="absolute -right-6 -top-4"
        theme="outline"
        size="24"
        fill="#333"
      />
    </div>
    <div
      class="content"
      v-html="article.content.replace(/[\r\n]/g, '<br />')"
    />
    <div class="footer">
      <ul class="tag-view">
        <li
          v-for="item of article.tags"
          :key="item.content"
          @click.prevent="tagClick(item.content)"
        >
          #{{ item.content }}
        </li>
      </ul>
    </div>
  </li>
</template>

<style scoped lang="scss">
li.card {
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
  }

  .more ul {
    visibility: hidden;
  }

  .footer {
    margin-top: 10px;

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
  }
}
</style>
