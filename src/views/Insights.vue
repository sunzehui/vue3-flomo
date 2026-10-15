<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElEmpty, vLoading } from 'element-plus'
import TopBar from '@/components/ui/topbar/index.vue'
import PageBody from '@/layouts/page-body.vue'
import { ApiUserOverview } from '@/api/user'
import type { UserOverview } from '@/api/user'
import { useUserStore } from '@/store/user'
import * as localMemo from '@/utils/localMemo'

const data = ref<UserOverview | null>(null)
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    if (!useUserStore().isAuthenticated) {
      data.value = localMemo.localOverview() as UserOverview
      return
    }
    const res = await ApiUserOverview()
    data.value = res.data ?? null
  }
  finally {
    loading.value = false
  }
}
load()

const cards = computed(() => {
  const d = data.value
  return [
    { label: 'MEMO', value: d?.memoCount ?? 0 },
    { label: 'TAG', value: d?.tagCount ?? 0 },
    { label: '连续记录', value: d?.streak ?? 0, suffix: '天' },
    { label: '活跃天数', value: d?.activeDays ?? 0, suffix: '天' },
  ]
})

const weeklyTrend = computed(() => data.value?.weeklyTrend ?? [])
const tagDistribution = computed(() => data.value?.tagDistribution ?? [])

const maxTrend = computed(() =>
  Math.max(1, ...weeklyTrend.value.map(item => item.count)),
)
const maxTag = computed(() =>
  Math.max(1, ...tagDistribution.value.map(item => item.count)),
)
</script>

<template>
  <div class="insights-view">
    <TopBar title="数据洞察" sticky />

    <PageBody v-loading="loading" class="!px-5">
      <div class="stat-grid">
        <div v-for="card in cards" :key="card.label" class="stat-card">
          <div class="stat-value">
            {{ card.value }}<span v-if="card.suffix" class="stat-suffix">{{ card.suffix }}</span>
          </div>
          <div class="stat-label">
            {{ card.label }}
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          近 12 周记录趋势
        </div>
        <div v-if="weeklyTrend.length" class="bar-chart">
          <div v-for="item in weeklyTrend" :key="item.week" class="bar-col">
            <div class="bar-wrap">
              <div class="bar" :style="{ height: `${Math.max(4, (item.count / maxTrend) * 100)}%` }" />
            </div>
            <div class="bar-label">
              {{ item.label }}
            </div>
          </div>
        </div>
        <ElEmpty v-else description="暂无数据" :image-size="60" />
      </div>

      <div class="section">
        <div class="section-title">
          标签分布 TOP 10
        </div>
        <div v-if="tagDistribution.length" class="tag-bars">
          <div v-for="item in tagDistribution" :key="item.content" class="tag-row">
            <div class="tag-name">
              #{{ item.content }}
            </div>
            <div class="tag-bar-track">
              <div class="tag-bar" :style="{ width: `${(item.count / maxTag) * 100}%` }" />
            </div>
            <div class="tag-count">
              {{ item.count }}
            </div>
          </div>
        </div>
        <ElEmpty v-else description="暂无数据" :image-size="60" />
      </div>
    </PageBody>
  </div>
</template>

<style lang="scss" scoped>
.insights-view {
  height: 100%;
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin: 12px 0;
}
.stat-card {
  @apply bg-base-fill rounded-md py-3 px-2;
  text-align: center;
  .stat-value {
    font-size: 22px;
    font-weight: 600;
    line-height: 1.2;
    @apply text-primary-text;
  }
  .stat-suffix {
    font-size: 11px;
    margin-left: 2px;
    @apply text-regular-text;
  }
  .stat-label {
    font-size: 11px;
    margin-top: 4px;
    @apply text-regular-text;
  }
}
.section {
  @apply bg-base-fill rounded-md p-3 mb-3;
  .section-title {
    font-size: 13px;
    margin-bottom: 12px;
    @apply text-secondary-text;
  }
}
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 120px;
}
.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  .bar-wrap {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: flex-end;
  }
  .bar {
    width: 100%;
    border-radius: 3px 3px 0 0;
    @apply bg-primary-light-2;
  }
  .bar-label {
    font-size: 10px;
    margin-top: 4px;
    @apply text-regular-text;
  }
}
.tag-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  .tag-name {
    width: 96px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    @apply text-tag-text;
  }
  .tag-bar-track {
    flex: 1;
    height: 8px;
    border-radius: 4px;
    @apply bg-light-fill;
    overflow: hidden;
  }
  .tag-bar {
    height: 100%;
    border-radius: 4px;
    @apply bg-primary-light-2;
  }
  .tag-count {
    width: 32px;
    text-align: right;
    @apply text-regular-text;
  }
}
</style>
