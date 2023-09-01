<script lang="ts" setup>
import { provide, ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useElementBounding } from '@vueuse/core'
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
watchEffect(() => {
  const tag = props.tag
  loadRemoteData({ tag })
  refreshUserInfo()
})
const cardContainerRef = ref(null)
const { x, y, top, right, bottom, left, width, height } = useElementBounding(cardContainerRef)

provide('cardContainerHeight', height)
</script>

<template>
  <div class="memo-view">
    <MemoTopBar />
    <div class="input-container">
      <MemoEditor :type="EditorType.create" />
    </div>
    <div ref="cardContainerRef" class="card-container">
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
