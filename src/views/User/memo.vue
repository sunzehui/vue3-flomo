<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElEmpty, vLoading } from 'element-plus'
import MemoCard from '@/components/ui/memo-card/index.vue'
import { ApiUser as ApiUserShare } from '@/api/share'
import type { Memo } from '@/types/memo'
import type { User } from '@/types/user'

const PAGE_SIZE = 20

const memoList = ref<Memo[]>([])
const userInfo = ref<User | null>(null)
const route = useRoute()

const page = ref(1)
const total = ref(0)
const hasMore = ref(false)
const loading = ref(false)
const userId = ref<string | number>('')

async function fetchPage(next = 1) {
  if (loading.value)
    return
  loading.value = true
  try {
    const res = await ApiUserShare({
      user_id: userId.value,
      page: next,
      pageSize: PAGE_SIZE,
    })
    const data = res.data
    userInfo.value = data.userInfo
    if (next === 1)
      memoList.value = data.usersMemo
    else
      memoList.value.push(...data.usersMemo)

    page.value = data.pagination.page
    hasMore.value = data.pagination.hasMore
    total.value = data.pagination.total
  }
  finally {
    loading.value = false
  }
}

function handleScroll(event: Event) {
  const el = event.target as HTMLElement
  if (!el || !hasMore.value)
    return
  const reachBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 200
  if (reachBottom)
    fetchPage(page.value + 1)
}

onMounted(() => {
  userId.value = route.params.id as string
  fetchPage(1)
})
</script>

<template>
  <div class="page-user-memo">
    <p>
      来自
      <span v-if="userInfo" class="highlight-nickname">
        {{ userInfo.nickname }}
      </span>
      的Memo
      <span v-if="total" class="total-text">（共 {{ total }} 条）</span>
    </p>
    <div class="memo-container" @scroll.passive="handleScroll" v-loading="loading && !memoList.length">
      <MemoCard
        v-for="memo in memoList"
        :key="memo.id"
        :memo="memo"
        readonly
      />

      <ElEmpty v-if="!loading && memoList.length === 0" description="0 memo" />

      <div v-if="memoList.length" class="load-more-tip">
        <span v-if="loading">加载中…</span>
        <span v-else-if="!hasMore">没有更多了</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-user-memo{
  height: 100%;

  @apply px-5;
  .highlight-nickname{
    @apply text-primary-light-1;
  }
  .total-text {
    @apply text-regular-text;
    font-size: 12px;
  }
}
.memo-container {
  overflow-y: scroll;
  height: 100%;
  padding-bottom: 300px;
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
</style>
