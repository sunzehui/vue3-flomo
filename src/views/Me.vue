<script setup lang="ts">
import { toRef, useClipboard, useColorMode } from '@vueuse/core'
import {
  ElButton,
  ElDialog,
  ElInput,
  ElMessage,
  ElRadioButton,
  ElRadioGroup,
} from 'element-plus'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import PageBody from '@/layouts/page-body.vue'
import TopBar from '@/components/ui/topbar/index.vue'
import { useUserStore } from '@/store/user'
import { ApiChangePassword } from '@/api/user'
import { ApiExport, ApiImport } from '@/api/data'

const { userInfo } = storeToRefs(useUserStore())
const { logout } = useUserStore()
const username = toRef(userInfo.value.username)
const nickname = toRef(userInfo.value.nickname)

const shareLink = computed(() => {
  if (!userInfo.value)
    return ''
  return `${window.location.origin}/user/${userInfo.value.id}`
})

const rssLink = computed(() => {
  if (!userInfo.value)
    return ''
  return `${window.location.origin}/api/share/feed/${userInfo.value.id}.xml`
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

const handleCopyRss = async () => {
  try {
    await navigator.clipboard.writeText(rssLink.value)
    ElMessage.success('RSS 地址已复制')
  }
  catch {
    ElMessage.warning('复制失败，请手动选择')
  }
}

const router = useRouter()
const handleSave = async () => {
  useUserStore().updateNickName(nickname)
}

const handleLogout = () => {
  logout()
  ElMessage.success('退出成功')
  setTimeout(() => {
    router.push({ name: 'Login' })
  }, 1000)
}

/** 外观：跟随系统 / 浅色 / 深色 */
const colorMode = useColorMode({ emitAuto: true })

/** 修改密码 */
const passwordDialog = ref(false)
const passwordForm = ref({ oldPassword: '', newPassword: '', confirm: '' })
const passwordLoading = ref(false)

async function submitPassword() {
  const { oldPassword, newPassword, confirm } = passwordForm.value
  if (!oldPassword || !newPassword)
    return ElMessage.warning('请填写完整')
  if (newPassword.length < 6)
    return ElMessage.warning('新密码至少 6 位')
  if (newPassword !== confirm)
    return ElMessage.warning('两次输入的新密码不一致')

  passwordLoading.value = true
  try {
    await ApiChangePassword({ oldPassword, newPassword })
    ElMessage.success('密码修改成功')
    passwordDialog.value = false
    passwordForm.value = { oldPassword: '', newPassword: '', confirm: '' }
  }
  catch (error: any) {
    ElMessage.error(error?.response?.data?.message ?? '修改失败')
  }
  finally {
    passwordLoading.value = false
  }
}

/** 导出 / 导入 */
const exporting = ref(false)
async function handleExport(format: 'json' | 'md') {
  exporting.value = true
  try {
    const res = await ApiExport(format)
    const { filename, content } = res.data
    const blob = new Blob([content], {
      type: format === 'md' ? 'text/markdown;charset=utf-8' : 'application/json;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    ElMessage.success(`已导出 ${res.data.total} 条`)
  }
  finally {
    exporting.value = false
  }
}

const importing = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function triggerImport() {
  fileInput.value?.click()
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file)
    return
  importing.value = true
  try {
    const text = await file.text()
    const parsed = JSON.parse(text)
    const memos = Array.isArray(parsed) ? parsed : parsed.memos
    if (!Array.isArray(memos))
      throw new Error('文件格式不正确')

    const res = await ApiImport(memos)
    ElMessage.success(`导入完成：新增 ${res.data.imported} 条，跳过 ${res.data.skipped} 条`)
    useUserStore().refreshUserInfo()
  }
  catch (error: any) {
    ElMessage.error(error?.message ?? '导入失败')
  }
  finally {
    importing.value = false
    if (input)
      input.value = ''
  }
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
        <div class="info-item">
          <span>
            RSS 订阅：
          </span>
          <div class="input-wrap w-26 mr-2">
            <ElInput
              :value="rssLink"
              disabled
              type="text" size="small" placeholder="rss"
            />
          </div>
          <ElButton type="default" size="small" @click="handleCopyRss">
            复制
          </ElButton>
        </div>
      </div>

      <div class="card user-info">
        <div class="card-title">
          外观
        </div>
        <div class="info-item">
          <ElRadioGroup v-model="colorMode" size="small">
            <ElRadioButton label="auto">
              跟随系统
            </ElRadioButton>
            <ElRadioButton label="light">
              浅色
            </ElRadioButton>
            <ElRadioButton label="dark">
              深色
            </ElRadioButton>
          </ElRadioGroup>
        </div>
      </div>

      <div class="card user-info">
        <div class="card-title">
          数据
        </div>
        <div class="info-item flex items-center gap-2">
          <ElButton type="default" size="small" :loading="exporting" @click="handleExport('json')">
            导出 JSON
          </ElButton>
          <ElButton type="default" size="small" :loading="exporting" @click="handleExport('md')">
            导出 Markdown
          </ElButton>
          <ElButton type="default" size="small" :loading="importing" @click="triggerImport">
            导入
          </ElButton>
          <input
            ref="fileInput"
            type="file"
            accept="application/json,.json"
            class="hidden"
            @change="handleFileChange"
          >
        </div>
        <div class="info-item text-xs">
          <span class="tip">导入会跳过内容完全相同的 memo，失败会整体回滚。</span>
        </div>
      </div>

      <div class="card user-info">
        <div class="card-title">
          账号操作
        </div>
        <div class="info-item flex items-center gap-2">
          <ElButton type="default" size="small" @click="passwordDialog = true">
            修改密码
          </ElButton>
          <ElButton type="danger" size="small" @click="handleLogout">
            退出登录
          </ElButton>
        </div>
      </div>
    </PageBody>

    <ElDialog v-model="passwordDialog" title="修改密码" width="360px">
      <ElInput
        v-model="passwordForm.oldPassword"
        type="password"
        show-password
        placeholder="原密码"
        class="mb-2"
      />
      <ElInput
        v-model="passwordForm.newPassword"
        type="password"
        show-password
        placeholder="新密码（至少 6 位）"
        class="mb-2"
      />
      <ElInput
        v-model="passwordForm.confirm"
        type="password"
        show-password
        placeholder="确认新密码"
      />
      <template #footer>
        <ElButton @click="passwordDialog = false">
          取消
        </ElButton>
        <ElButton type="primary" :loading="passwordLoading" @click="submitPassword">
          确定
        </ElButton>
      </template>
    </ElDialog>
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
    @apply bg-base-fill mb-3;
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
      .tip {
        @apply text-regular-text;
      }
  }
}
</style>
