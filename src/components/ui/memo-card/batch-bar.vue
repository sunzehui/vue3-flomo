<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  ElButton,
  ElDialog,
  ElInput,
  ElMessage,
} from 'element-plus'
import { useClipboard } from '@vueuse/core'
import { useMemoStore } from '@/store/memo'
import { ApiCreateSelection, ApiRevokeSelection } from '@/api/share'

const memoStore = useMemoStore()

const selectedCount = computed(() => memoStore.selectedIds.length)
const allIds = computed(() => memoStore.articleList.map(item => item.id))
const allSelected = computed(
  () => allIds.value.length > 0 && memoStore.selectedIds.length === allIds.value.length,
)

const toggleAll = () => {
  if (allSelected.value)
    memoStore.clearSelection()
  else
    memoStore.selectAll(allIds.value)
}

const exitBatch = () => memoStore.toggleBatchMode(false)

/** 标签输入：支持逗号/空格/顿号分隔的多个标签 */
const tagInput = ref('')
const busy = ref(false)
const parseTags = () =>
  tagInput.value
    .split(/[,\s，、]+/)
    .map(item => item.trim())
    .filter(Boolean)

async function applyTag(mode: 'add' | 'remove') {
  const tags = parseTags()
  if (!tags.length)
    return ElMessage.warning('请输入标签名')
  if (!selectedCount.value)
    return ElMessage.warning('请先选择 memo')

  busy.value = true
  try {
    await memoStore.batchTag(
      memoStore.selectedIds,
      mode === 'add' ? { add: tags } : { remove: tags },
    )
    tagInput.value = ''
  }
  catch (error: any) {
    ElMessage.error(error?.response?.data?.message ?? '操作失败')
  }
  finally {
    busy.value = false
  }
}

/** 精选分享 */
const shareDialog = ref(false)
const shareLink = ref('')
const shareTitle = ref('')
const shareToken = ref('')
const { copy, isSupported } = useClipboard({ source: shareLink })

async function createSelection() {
  if (!selectedCount.value)
    return ElMessage.warning('请先选择 memo')
  busy.value = true
  try {
    const res = await ApiCreateSelection({
      title: shareTitle.value,
      articleIds: memoStore.selectedIds,
    })
    shareToken.value = res.data.token
    shareLink.value = `${window.location.origin}/share/selection/${res.data.token}`
    shareDialog.value = true
  }
  catch (error: any) {
    ElMessage.error(error?.response?.data?.message ?? '生成失败')
  }
  finally {
    busy.value = false
  }
}

function handleCopy() {
  if (!isSupported)
    return ElMessage.warning('当前浏览器不支持复制功能')
  copy()
  ElMessage.success('链接已复制')
}

async function revokeSelection() {
  if (!shareToken.value)
    return
  try {
    await ApiRevokeSelection(shareToken.value)
    ElMessage.success('已撤销该分享')
    shareDialog.value = false
  }
  catch (error: any) {
    ElMessage.error(error?.response?.data?.message ?? '撤销失败')
  }
}
</script>

<template>
  <div class="batch-bar">
    <div class="bar-inner">
      <span class="count">已选 <b>{{ selectedCount }}</b> 条</span>
      <ElButton size="small" text @click="toggleAll">
        {{ allSelected ? '取消全选' : '全选本页' }}
      </ElButton>

      <div class="divider" />

      <ElInput
        v-model="tagInput"
        size="small"
        class="tag-input"
        placeholder="标签名，多个用空格分隔"
        @keyup.enter="applyTag('add')"
      />
      <ElButton size="small" type="primary" :loading="busy" @click="applyTag('add')">
        加标签
      </ElButton>
      <ElButton size="small" :loading="busy" @click="applyTag('remove')">
        去标签
      </ElButton>

      <div class="divider" />

      <ElButton size="small" type="success" :loading="busy" @click="createSelection">
        生成精选分享
      </ElButton>
      <ElButton size="small" text @click="exitBatch">
        退出
      </ElButton>
    </div>

    <ElDialog v-model="shareDialog" title="精选分享" width="420px">
      <p class="share-tip">
        该链接任何人可访问，仅包含你本次选中的 {{ selectedCount }} 条 memo。
      </p>
      <ElInput :value="shareLink" readonly>
        <template #append>
          <ElButton @click="handleCopy">
            复制
          </ElButton>
        </template>
      </ElInput>
      <template #footer>
        <ElButton type="danger" text @click="revokeSelection">
          撤销分享
        </ElButton>
        <ElButton type="primary" @click="shareDialog = false">
          关闭
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped>
.batch-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.bar-inner {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 18px;
  padding: 8px 14px;
  border-radius: 10px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.16);
  @apply bg-base-fill text-primary-text;
}

.count {
  font-size: 13px;
  @apply text-regular-text;

  b {
    @apply text-primary-text;
    font-size: 15px;
  }
}

.divider {
  width: 1px;
  height: 18px;
  @apply bg-dark-fill-1;
}

.tag-input {
  width: 180px;
}

.share-tip {
  font-size: 12px;
  margin-bottom: 8px;
  @apply text-regular-text;
}
</style>
