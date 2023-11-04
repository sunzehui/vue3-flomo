<script lang="ts" setup>
import TagList from '@/components/ui/sidebar/tag-list.vue'
import PageList from '@/components/ui/sidebar/page-list/index.vue'
import HeatMap from '@/components/ui/sidebar/heat-map.vue'
import UserStatistical from '@/components/ui/sidebar/UserStatistical.vue'
import UserTitle from '@/components/ui/topbar/UserTitle.vue'
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
    @apply h-full overflow-y-scroll;
    width: 240px;
    min-width: 218px;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  i {
    font-style: normal;
  }
</style>
