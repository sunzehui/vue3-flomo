<script setup lang="ts">
import {
  Comment,
  DeleteFilled,
  Menu,
  TrendCharts,
} from '@element-plus/icons-vue'
import SideBarItem from './page-item.vue'
const barGroup = [
  {
    key: 'memo',
    to: '/memo',
    icon: Menu,
    title: 'MEMO',
  },
  {
    key: 'wechat',
    to: '/wechat',
    icon: Comment,
    title: '微信输入',
  },
  {
    key: 'review',
    to: '/review',
    icon: TrendCharts,
    title: '每日回顾',
  },
  {
    key: 'recycle',
    to: '/recycle',
    icon: DeleteFilled,
    title: '回收站',
  },
]
</script>

<template>
  <div class="bar-list">
    <SideBarItem v-for="item in barGroup" :key="item.key" :to="item.to">
      <template #icon>
        <Component :is="item.icon" />
      </template>
      {{ item.title }}
    </SideBarItem>
  </div>
</template>

<style scoped>
.bar-list {
  margin: 8px 0 18px;
  color: #9d9d9d;
}
</style>
