<script setup lang="ts">
import { resolveRef } from '@vueuse/core'
import { ElButton, ElInput, ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useUserStore } from '@/store/user'
import { ApiUpdateUserInfo } from '@/api/user'
const { userInfo } = storeToRefs(useUserStore())
const { logout } = useUserStore()
const username = resolveRef(userInfo.value.username)
const nickname = resolveRef(userInfo.value.nickname)
const shareLink = computed(() => {
  return `${window.location.origin}/user/${userInfo.value.id}`
})
const handleCopyLink = () => {
  const input = document.createElement('input')
  input.value = shareLink.value
  document.body.appendChild(input)
  input.select()
  document.execCommand('Copy')
  document.body.removeChild(input)
  ElMessage.success('复制成功')
}
const router = useRouter()
const handleSave = async () => {
  useUserStore().updateNickName(nickname)
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
      <div class="card-title">
        基本信息
      </div>
      <div class="info-item user-name">
        账号：{{ username }}
      </div>
      <div class="info-item flex items-center">
        <span>
          昵称：
        </span>
        <div class="input-wrap w-26 mr-2">
          <ElInput v-model="nickname" type="text" class="h-8" size="small" placeholder="浮墨用户" />
        </div>
        <ElButton type="default" @click="handleSave">
          保存
        </ElButton>
      </div>
      <div class="info-item">
        <span>
          外部分享链接：
        </span>
        <div class="input-wrap w-26 mr-2">
          <ElInput
            :value="shareLink"
            type="text" class="h-8" size="small" placeholder="link"
          />
        </div>
        <ElButton type="default" @click="handleCopyLink">
          复制
        </ElButton>
      </div>
    </div>
    <div class="card user-info">
      <div class="card-title">
        账号操作
      </div>
      <div class="info-item flex items-center">
        <ElButton type="danger" @click="handleLogout">
          退出登录
        </ElButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-profile{
  @apply p-5 space-y-5;
  .page-title{
      color: #333;
      @apply text-base font-bold;
  }
  .card{
    border-radius: 4px;
    background-color: #fff;
    .card-title{
      @apply text-sm font-thin pt-4 text-neutral-500;
    }
 }
  .user-info{
      font-size: 16px;
      font-weight: 500;
      display: flex;
      flex-direction: column;
      @apply py-3 px-2;

      .info-item{
        @apply mt-2;
        display: flex;
      }
  }
}
</style>
