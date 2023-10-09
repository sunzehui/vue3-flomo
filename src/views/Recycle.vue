<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { ElAlert, ElBacktop, ElEmpty, ElLoading, vLoading } from 'element-plus'
import { provide, ref, unref, watchEffect } from 'vue'
import { useAsyncState, useElementBounding } from '@vueuse/core'
import TopBar from '@/components/ui/topbar/index.vue'
import PageBody from '@/layouts/page-body.vue'
import MemoCard from '@/components/ui/memo-card/deleted.vue'
import { useMemoStore } from '@/store/memo'

const { deletedMemoList } = storeToRefs(useMemoStore())
const { loadDeletedMemo } = useMemoStore()

const { isLoading } = useAsyncState(loadDeletedMemo, null)

</script>

<template>
  <div class="memo-view flex flex-col">
    <TopBar title="回收站" sticky />

    <div class="header px-5 mb-2">
      <ElAlert title="在回收站中超过 30 天的 MEMO 将会自动删除" type="info" show-icon />
    </div>

    <PageBody v-loading="isLoading" class="flex-1 !px-0">
      <div v-if="!isLoading && deletedMemoList.length" class="card-container">
        <template v-for="memo of deletedMemoList " :key="memo.id">
          <MemoCard :memo="memo" />
        </template>
      </div>
      <ElEmpty v-if="!isLoading && deletedMemoList.length === 0" description="0 memo" />
    </PageBody>
  </div>
</template>

<style lang="scss" scoped>
.input-container {
  @apply px-5;
}

.memo-view {
  height: 100%;
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
</style>
