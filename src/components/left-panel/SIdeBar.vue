<script setup lang="ts">
import {
  Menu,
  Comment,
  TrendCharts,
  DeleteFilled,
} from "@element-plus/icons-vue";
import SideBarItem from './SideBarItem.vue'

</script>

<template>
  <div class="bar-list">
    <SideBarItem to="/memo" key="memo">
      <template #icon>
        <Menu/>
      </template>
      MEMO
    </SideBarItem>
    <SideBarItem to="/wechat" key="wechat">
      <template #icon>
        <Comment/>
      </template>
      微信输入
    </SideBarItem>
    <SideBarItem to="/review" key="review">
      <template #icon>
        <TrendCharts/>
      </template>
      每日回顾
    </SideBarItem>
    <SideBarItem to="/recycle" key="recycle">
      <template #icon>
        <DeleteFilled/>
      </template>
      回收站
    </SideBarItem>
  </div>
</template>


<style scoped>
.bar-list {
  margin: 8px 0 18px;
  color: #9d9d9d;
}
</style>