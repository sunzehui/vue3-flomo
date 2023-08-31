<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { watchEffect } from 'vue'
import TopBar from '@/components/ui/topbar/index.vue'
import PageBody from '@/layouts/page-body.vue'
import MemoCard from '@/components/ui/memo-card/deleted.vue'
import { useMemoStore } from '@/store/memo'

const { deletedMemoList } = storeToRefs(useMemoStore())
const { loadDeletedMemo } = useMemoStore()
watchEffect(() => {
  loadDeletedMemo()
})
</script>

<template>
  <div class="memo-view flex flex-col">
    <TopBar title="回收站" sticky />
    <PageBody class="flex-1">
      <div class="card-container">
        <template v-for="memo of deletedMemoList " :key="memo.id">
          <MemoCard :memo="memo" />
        </template>
      </div>
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
</style>
