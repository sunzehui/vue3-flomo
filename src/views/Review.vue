<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElButton, ElEmpty, ElMessage, vLoading } from 'element-plus'
import TopBar from '@/components/ui/topbar/index.vue'
import PageBody from '@/layouts/page-body.vue'
import MemoCard from '@/components/ui/memo-card/index.vue'
import { ApiDailyReview, ApiMarkReview } from '@/api/review'
import type { Memo } from '@/types/memo'

const list = ref<Memo[]>([])
const finished = ref(false)
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    const res = await ApiDailyReview(6)
    list.value = (res.data ?? []) as Memo[]
  }
  finally {
    loading.value = false
  }
}
load()

const remain = computed(() => list.value.length)

/** 标记今日回顾完成，今天不会再重复推送同一批 */
async function handleFinish() {
  if (list.value.length)
    await ApiMarkReview(list.value.map(memo => memo.id))
  finished.value = true
  ElMessage.success('今日回顾完成，明天见')
}

function handleRefresh() {
  finished.value = false
  load()
}
</script>

<template>
  <div class="memo-view">
    <TopBar title="每日回顾" sticky />

    <PageBody v-loading="loading" class="!px-5">
      <div v-if="finished" class="review-done">
        <ElEmpty description="今天的回顾已完成，明天再来吧" />
      </div>

      <template v-else>
        <p class="review-tip">
          回看 {{ remain }} 条旧 memo，想想有没有要补充或加标签的
        </p>

        <MemoCard v-for="memo in list" :key="memo.id" :memo="memo" />

        <div v-if="list.length" class="review-actions">
          <ElButton type="primary" @click="handleFinish">
            就这些，完成
          </ElButton>
          <ElButton @click="handleRefresh">
            换一批
          </ElButton>
        </div>

        <ElEmpty v-else-if="!loading" description="还没有可回顾的 memo" />
      </template>
    </PageBody>
  </div>
</template>

<style lang="scss" scoped>
.memo-view {
  height: 100%;
}
.review-tip {
  font-size: 12px;
  padding: 8px 0;
  @apply text-secondary-text;
}
.review-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px 0 40px;
}
.review-done {
  padding-top: 40px;
}
</style>
