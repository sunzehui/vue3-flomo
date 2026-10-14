<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElEmpty, vLoading } from 'element-plus'
import MemoCard from '@/components/ui/memo-card/index.vue'
import { ApiGetSelection } from '@/api/share'
import type { Memo } from '@/types/memo'
import type { User } from '@/types/user'

const route = useRoute()
const loading = ref(false)
const error = ref('')
const title = ref('')
const createdAt = ref('')
const userInfo = ref<User | null>(null)
const memoList = ref<Memo[]>([])

onMounted(async () => {
  loading.value = true
  try {
    const res = await ApiGetSelection(route.params.token as string)
    title.value = res.data.title
    createdAt.value = res.data.createdAt
    userInfo.value = res.data.userInfo
    memoList.value = res.data.usersMemo
  }
  catch (err: any) {
    error.value = err?.response?.data?.message ?? '分享不存在或已失效'
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page-selection">
    <header class="selection-header">
      <h1 class="title">
        {{ title || '精选分享' }}
      </h1>
      <p v-if="userInfo" class="sub">
        由 <b>{{ userInfo.nickname || userInfo.username }}</b> 精选 · 共 {{ memoList.length }} 条
      </p>
    </header>

    <div v-loading="loading" class="memo-container">
      <MemoCard
        v-for="memo in memoList"
        :key="memo.id"
        :memo="memo"
        readonly
      />

      <ElEmpty v-if="!loading && !memoList.length" :description="error || '0 memo'" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-selection {
  height: 100%;
  max-width: 720px;
  margin: 0 auto;
  @apply px-5;
}

.selection-header {
  padding: 28px 0 6px;

  .title {
    font-size: 22px;
    font-weight: 700;
    @apply text-primary-text;
  }

  .sub {
    margin-top: 6px;
    font-size: 12px;
    @apply text-regular-text;

    b {
      @apply text-primary-light-1;
    }
  }
}

.memo-container {
  overflow-y: auto;
  height: calc(100% - 90px);
  padding-bottom: 160px;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
