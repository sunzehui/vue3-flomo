<script lang="ts" setup>
import TagList from './tag-list.vue'
import PageList from '@/components/ui/page-list/index.vue'
import HeatMap from '@/components/ui/heat-map.vue'
import UserStatistical from '@/components/ui/UserStatistical.vue'
import UserTitle from '@/components/ui/UserTitle.vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
</script>

<template>
  <div class="left">
    <UserTitle :nickname="userStore.nickname" :is-pro="true" />
    <UserStatistical />
    <HeatMap />
    <PageList />
    <TagList />
  </div>
</template>

<style lang="scss" scoped>
  .left {
    @apply h-full;
    width: 240px;
    min-width: 218px;
  }

  i {
    font-style: normal;
  }
</style>
