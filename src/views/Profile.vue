<script setup lang="ts">
import { resolveRef } from '@vueuse/core'
import { ElButton, ElInput, ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ApiUpdateUserInfo } from '@/api/user'
const { userInfo } = storeToRefs(useUserStore())
const { logout } = useUserStore()
const username = resolveRef(userInfo.value.username)
const nickname = resolveRef(userInfo.value.nickname)

const router = useRouter()
const handleSave = async () => {
  const res = await ApiUpdateUserInfo({ nickname: nickname.value })
  console.log(res)
}
const handleLogout = () => {
  logout()
  ElMessage.success('退出成功')
  setTimeout(() => {
    router.push('/login')
  }, 1000)
}
</script>

<template>
  <div class="page-profile">
    <div class="page-title">
      <h2>账号详情</h2>
    </div>
    <div class="card user-info">
      <div class="info-item user-name">
        账号：{{ username }}
      </div>
      <div class="info-item flex items-center">
        昵称：<div class="input-wrap w-26">
          <ElInput v-model="nickname" type="text" class="h-8" size="small" placeholder="浮墨用户" />
        </div>
      </div>
      <div class="info-item flex items-center">
        <ElButton type="primary" @click="handleSave">
          保存
        </ElButton>
      </div>

      <div class="info-item flex items-center">
        <ElButton type="warning" @click="handleLogout">
          退出登录
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
      display: flex;
      flex-direction: column;

      .info-item{
        @apply mt-2;
        display: flex;
      }
  }
}
</style>
