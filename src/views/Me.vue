<script setup lang="ts">
import { toRef, useClipboard } from '@vueuse/core'
import { ElButton, ElInput, ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import PageBody from '@/layouts/page-body.vue'
import TopBar from '@/components/ui/topbar/index.vue'
import { useUserStore } from '@/store/user'
const { userInfo } = storeToRefs(useUserStore())
const { logout } = useUserStore()
const username = toRef(userInfo.value.username)
const nickname = toRef(userInfo.value.nickname)
const shareLink = computed(() => {
  if (!userInfo.value)
    return ''
  return `${window.location.origin}/user/${userInfo.value.id}`
})
const {
  copy, text, isSupported,
} = useClipboard({ source: shareLink })

const handleCopyLink = () => {
  if (!isSupported)
    return ElMessage.warning('您的浏览器不支持复制功能')
  copy()
  ElMessage.success(`复制成功：${text.value}`)
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
    <TopBar title="账号详情" />

    <PageBody>
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
            <ElInput v-model="nickname" type="text" size="small" placeholder="浮墨用户" />
          </div>
          <ElButton type="default" size="small" @click="handleSave">
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
              disabled
              type="text" size="small" placeholder="link"
            />
          </div>
          <ElButton type="default" size="small" @click="handleCopyLink">
            复制
          </ElButton>
        </div>
      </div>
      <div class="card user-info">
        <div class="card-title">
          账号操作
        </div>
        <div class="info-item flex items-center">
          <ElButton type="danger" size="small" @click="handleLogout">
            退出登录
          </ElButton>
        </div>
      </div>
    </PageBody>
  </div>
</template>

<style lang="scss" scoped>
.page-profile{
  .page-title{
      // color: #333;
    @apply text-primary-text font-bold;
  }

  .card{
    border-radius: 4px;
    // background-color: #fff;
    @apply bg-base-fill;
    .card-title{
      @apply text-sm font-thin text-secondary-text;
    }
 }
  .user-info{
      font-size: 12px;
      font-weight: 500;
      display: flex;
      flex-direction: column;
      @apply py-3 px-2;

      .info-item{
        @apply mt-2 flex items-center;
      }
  }
}
</style>
