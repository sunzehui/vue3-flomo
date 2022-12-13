<script setup lang="ts">
import { resolveRef } from '@vueuse/core'
import { ElButton, ElInput } from 'element-plus'
const nickname = resolveRef('')
</script>

<template>
  <div class="page-profile">
    <div class="page-title">
      <h2>账号详情</h2>
    </div>
    <div class="card user-info">
      <div class="info-item user-name">
        账号：123456
      </div>
      <div class="info-item flex items-center">
        昵称：<div class="input-wrap w-26">
          <ElInput v-model="nickname" type="text" class="h-8" size="small" placeholder="sunzehui" />
        </div>
        <ElButton class="ml-3" type="primary">
          保存
        </ElButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-profile{
  .page-title{
    @apply p-3;
    h2{
      font-size: 18px;
      font-weight: 500;
      color: #333;
    }
  }
  .card{
    border-radius: 4px;
    background-color: #fff;
    padding: 20px;
 }
  .user-info{
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 10px;
      .info-item{
        @apply mt-2;
        display: flex;
      }
  }
}
</style>
