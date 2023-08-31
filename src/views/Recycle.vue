<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { watchEffect } from 'vue'
import TopBar from '@/components/ui/topbar/index.vue'
import PageBody from '@/layouts/page-body.vue'
import MemoCard from '@/components/ui/memo-card/deleted.vue'
import { useArticleStore } from '@/store/article'

const { articleListEnhance } = storeToRefs(useArticleStore())
watchEffect(() => {
  console.log('🚀 ~ file: Recycle.vue:9 ~ articleListEnhance:', articleListEnhance)
})
</script>

<template>
  <div class="memo-view flex flex-col">
    <TopBar title="回收站" sticky />
    <PageBody class="flex-1">
      <div class="card-container">
        <template v-for="memo of articleListEnhance" :key="memo.id">
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
