<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import TagList from '@/components/ui/sidebar/tag-list.vue'
import PageList from '@/components/ui/sidebar/page-list/index.vue'
import HeatMap from '@/components/ui/sidebar/heat-map.vue'
import UserStatistical from '@/components/ui/sidebar/UserStatistical.vue'
import UserTitle from '@/components/ui/topbar/UserTitle.vue'
import { useUserStore } from '@/store/user'
import { useMemoStore } from '@/store/memo'
import { downloadBackup, exportLocalData, importLocalData } from '@/utils/localMemo'
import type { LocalBackup } from '@/utils/localMemo'

const userStore = useUserStore()
const memoStore = useMemoStore()

const exporting = ref(false)
const handleExport = async () => {
  if (exporting.value)
    return
  exporting.value = true
  try {
    const backup = await exportLocalData()
    downloadBackup(backup)
    ElMessage.success(`已导出 ${backup.memos.length} 条笔记`)
  }
  catch {
    ElMessage.error('导出失败')
  }
  finally {
    exporting.value = false
  }
}

const fileInput = ref<HTMLInputElement | null>(null)
const importing = ref(false)
const handlePickImport = () => {
  fileInput.value?.click()
}
const handleImportFile = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = '' // 允许重复选择同一文件
  if (!file)
    return
  if (importing.value)
    return
  importing.value = true
  try {
    const text = await file.text()
    const backup = JSON.parse(text) as LocalBackup
    const { value } = await ElMessageBox.confirm(
      `合并导入（推荐）：保留现有数据，跳过重复项\n\n覆盖导入：清空当前数据后整体恢复`,
      '选择导入方式',
      {
        distinguishCancelAndClose: true,
        confirmButtonText: '覆盖导入',
        cancelButtonText: '合并导入',
        type: 'warning',
      },
    )
    const mode = value === 'confirm' ? 'replace' : 'merge'
    const res = await importLocalData(backup, mode)
    ElMessage.success(`导入完成：新增 ${res.memos} 条笔记、${res.tags} 个标签、${res.images} 张图片`)
    memoStore.getMemoList()
    memoStore.getTagList()
    userStore.refreshUserInfo()
  }
  catch (e) {
    if (e !== 'cancel' && e?.message)
      ElMessage.error(e.message || '导入失败')
  }
  finally {
    importing.value = false
  }
}
</script>

<template>
  <div class="left">
    <UserTitle :nickname="userStore.nickname" :is-pro="true" />
    <template v-if="!userStore.isAuthenticated">
      <router-link
        to="/user/auth/login"
        class="local-tip"
      >
        本地模式：数据仅存本机 · 登录后可云同步
      </router-link>
      <div class="data-actions">
        <button class="data-btn" :disabled="exporting" @click="handleExport">
          导出数据
        </button>
        <button class="data-btn" :disabled="importing" @click="handlePickImport">
          导入数据
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="application/json,.json"
          class="hidden-input"
          @change="handleImportFile"
        >
      </div>
    </template>
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

  .local-tip {
    @apply block mt-1 px-2 py-1.5 rounded text-xs leading-4 bg-dark-fill-2 text-gray-500;
    &:hover {
      @apply text-primary;
    }
  }

  .data-actions {
    @apply flex gap-1.5 mt-1.5 px-2;
  }
  .data-btn {
    @apply flex-1 py-1 rounded text-xs bg-dark-fill-2 text-gray-500 border-none cursor-pointer;
    &:hover {
      @apply text-primary;
    }
    &:disabled {
      @apply opacity-50 cursor-not-allowed;
    }
  }
  .hidden-input {
    display: none;
  }
</style>
