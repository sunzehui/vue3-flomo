<script lang="ts" setup>
import {
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
} from 'element-plus'
import { useEventBus } from '@vueuse/core'
import { Right as RightIcon } from '@/components/icon'
import { useMemoStore } from '@/store/memo'

import { CardType } from '@/types/card-type'
import { MEMO_CARD } from '@/common/event-bus'
import type { Memo } from '@/types/memo'
const props = defineProps<{
  article: Memo
  isDeleted?: boolean
}>()
const articleStore = useMemoStore()

const { emit: busEmit } = useEventBus(MEMO_CARD)
type acType =
  | 'cancel-top'
  | 'delete'
  | 'edit'
  | 'detail'
  | 'set-top'
  | 'get-link'
  | 'recycle'

const reducerAction = (event: Event) => {
  const type = (event.target as HTMLLIElement).dataset.type as acType

  switch (type) {
    case 'delete':
      articleStore.deleteMemo(+props.article.id)
      break
    case 'detail':
      busEmit({ action: 'open-detail-card' }, props.article)
      break
    case 'get-link':
      busEmit({ action: 'open-share-card' }, props.article)
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
    case 'recycle':
      articleStore.recycleMemo(props.article.id)
      break
    default:
      break
  }
}
</script>

<template>
  <ElDropdown>
    <span class="el-dropdown-link">
      <RightIcon />
    </span>
    <template #dropdown>
      <ElDropdownMenu @click="reducerAction">
        <template
          v-if="isDeleted"
        >
          <ElDropdownItem
            data-type="recycle"
          >
            恢复
          </ElDropdownItem>
        </template>
        <template v-else>
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
            移入回收站
          </ElDropdownItem>
        </template>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
