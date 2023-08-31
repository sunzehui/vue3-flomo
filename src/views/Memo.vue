<script lang="ts" setup>
import { watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import TopBar from '@/components/ui/topbar/index.vue'
import MemoEditor from '@/components/ui/editor/index.vue'
import MemoCardOrEditor from '@/components/MemoCardOrEditor'
import { useMemoStore } from '@/store/memo'
import DetailPanel from '@/components/ui/DetailPanel.vue'
import ShareCard from '@/components/ui/ShareCard.vue'

import { EditorType } from '@/types/card-type'
import { useUserStore } from '@/store/user'
import MemoTopBar from '@/components/ui/memo-top-bar.vue'

const props = defineProps<{ tag?: string }>()

const { enhancedMemoList } = storeToRefs(useMemoStore())
const { loadRemoteData } = (useMemoStore())

const { refreshUserInfo } = useUserStore()
watchEffect(() => {
  const tag = props.tag
  loadRemoteData({ tag })
  refreshUserInfo()
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
