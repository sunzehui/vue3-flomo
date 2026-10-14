<script lang="ts" setup>
import { onUnmounted, ref, watchEffect } from 'vue'
import { ElEmpty } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useAsyncState } from '@vueuse/core'
import MemoEditor from '@/components/ui/editor/index.vue'
import MemoCardOrEditor from '@/components/MemoCardOrEditor'
import { useMemoStore } from '@/store/memo'
import DetailPanel from '@/components/ui/memo-card/DetailPanel.vue'
import ShareCard from '@/components/ui/memo-card/ShareCard.vue'
import BatchBar from '@/components/ui/memo-card/batch-bar.vue'
import { EditorType } from '@/types/card-type'
import { useUserStore } from '@/store/user'
import MemoTopBar from '@/components/ui/topbar/memo-top-bar.vue'

const props = defineProps<{ tag?: string }>()

const memoStore = useMemoStore()
const { enhancedMemoList, isLoading, hasMore, total, isBatchMode } = storeToRefs(memoStore)

const { refreshUserInfo } = useUserStore()
refreshUserInfo()

const cardContainer = ref<HTMLElement | null>(null)

/** 触底自动加载下一页 */
function handleScroll(event: Event) {
  const el = event.target as HTMLElement
  if (!el)
    return
  const reachBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 200
  if (reachBottom)
    memoStore.loadMore()
}

let tag = props.tag
const { execute } = useAsyncState(() => memoStore.loadRemoteData({ tag }), null, { immediate: false })
watchEffect(() => {
  tag = props.tag
  execute()
})

// 批量模式是全局状态，离开本页时复位，避免影响回顾/回收站等其它列表
onUnmounted(() => memoStore.toggleBatchMode(false))
</script>

<template>
  <div class="memo-view">
    <MemoTopBar />
    <div class="input-container">
      <MemoEditor :type="EditorType.create" />
    </div>
    <div ref="cardContainer" class="card-container" @scroll.passive="handleScroll">
      <template v-for="memo of enhancedMemoList" :key="memo.id">
        <MemoCardOrEditor :memo="memo" />
      </template>

      <ElEmpty v-if="!isLoading && enhancedMemoList.length === 0" description="0 memo" />

      <div v-if="enhancedMemoList.length" class="load-more-tip">
        <span v-if="isLoading">加载中…</span>
        <span v-else-if="!hasMore">没有更多了（共 {{ total }} 条）</span>
      </div>
    </div>

    <DetailPanel />
    <ShareCard />
    <BatchBar v-if="isBatchMode" />
  </div>
</template>

<style lang="scss" scoped>
.memo-view {
  height: 100%;
  .input-container {
    @apply px-5;
  }
  .card-container {
    overflow-y: scroll;
    height: 100%;
    padding-bottom: 300px;
    @apply px-5;
    //谷歌适用
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .load-more-tip {
    text-align: center;
    font-size: 12px;
    padding: 12px 0 4px;
    @apply text-regular-text;
  }
}
</style>
