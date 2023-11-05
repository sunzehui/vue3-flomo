<script lang="ts" setup>
import { watchEffect } from 'vue'
import { ElEmpty } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useAsyncState, useElementBounding } from '@vueuse/core'
import MemoEditor from '@/components/ui/editor/index.vue'
import MemoCardOrEditor from '@/components/MemoCardOrEditor'
import { useMemoStore } from '@/store/memo'
import DetailPanel from '@/components/ui/memo-card/DetailPanel.vue'
import ShareCard from '@/components/ui/memo-card/ShareCard.vue'

import { EditorType } from '@/types/card-type'
import { useUserStore } from '@/store/user'
import MemoTopBar from '@/components/ui/topbar/memo-top-bar.vue'

const props = defineProps<{ tag?: string }>()

const { enhancedMemoList } = storeToRefs(useMemoStore())
const { loadRemoteData } = (useMemoStore())

const { refreshUserInfo } = useUserStore()
refreshUserInfo()

let tag = props.tag
const { isLoading, execute } = useAsyncState(() => loadRemoteData({ tag }), null, { immediate: false })
watchEffect(() => {
  tag = props.tag
  execute()
})
</script>

<template>
  <div class="memo-view">
    <MemoTopBar />
    <div class="input-container">
      <MemoEditor :type="EditorType.create" />
    </div>
    <div class="card-container">
      <template v-for="memo of enhancedMemoList" :key="memo.id">
        <MemoCardOrEditor :memo="memo" />
      </template>

      <ElEmpty v-if="!isLoading && enhancedMemoList.length === 0" description="0 memo" />
    </div>

    <DetailPanel />
    <ShareCard />
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
}
</style>
