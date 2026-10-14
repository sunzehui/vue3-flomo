<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { isEmpty } from 'lodash-es'
import { ElMessageBox } from 'element-plus'
import Editor from './text-editor.vue'
import ToolBar from './toolbar.vue'
import { EditorType } from '@/types/card-type'
import type { Memo } from '@/types/memo'
import { useMemoEditor } from '@/composable/useMemoEditor'
import { useUserStore } from '@/store/user'
import { buildDraftKey, clearDraft, readDraft, saveDraft } from '@/composable/useDraft'
import { unTrim, unescapeHtml } from '@/utils/editor'

const props = defineProps<{
  memo?: Memo
  type: EditorType
}>()

const editorRef = ref(null)
const toolbarRef = ref(null)

const {
  handler,
  tagList,
  loading,
  registerComponentRef,
  setEditorConfig,
  memo: _memo,
} = useMemoEditor()

const userStore = useUserStore()
const draftKey = computed(() =>
  buildDraftKey(userStore.userInfo?.id, 'create'),
)

let draftTimer: ReturnType<typeof setTimeout> | undefined

/** 只在「新建」编辑器上做草稿自动保存 */
function handleChange(content: string) {
  handler.handleEditorChange(content)
  if (props.type !== EditorType.create)
    return

  if (draftTimer)
    clearTimeout(draftTimer)

  // 内容为空说明已提交或用户清空，直接删掉草稿
  if (!content || !content.trim()) {
    clearDraft(draftKey.value)
    return
  }
  draftTimer = setTimeout(() => saveDraft(draftKey.value, content), 1500)
}

onMounted(() => {
  registerComponentRef(editorRef, toolbarRef)
  // 编辑时会传入memo信息
  setEditorConfig({
    type: props.type,
    memo: props.memo,
  })

  // 新建时恢复未提交的草稿
  if (props.type === EditorType.create) {
    const draft = readDraft(draftKey.value)
    if (draft) {
      ElMessageBox.confirm('检测到上次未提交的草稿，是否恢复？', '草稿恢复', {
        confirmButtonText: '恢复',
        cancelButtonText: '丢弃',
        type: 'info',
      })
        .then(() => {
          editorRef.value?.setContent(draft)
        })
        .catch(() => {
          clearDraft(draftKey.value)
        })
    }
  }
})

onUnmounted(() => {
  if (draftTimer)
    clearTimeout(draftTimer)
})

const editorFocused = ref(false)
const initContent = computed(() => {
  if (props.type === EditorType.edit)
    return unTrim(props.memo.content)

  return ''
})
const handleMouse = (e) => {
  const target = e.target as HTMLElement
  if (target.tagName !== 'TEXTAREA') {
    e.preventDefault()
    return false
  }
}
</script>

<template>
  <div class="editor" :class="{ focused: editorFocused }" @mousedown="handleMouse">
    <Editor
      ref="editorRef"
      :suggestion-list="tagList"
      :type="type"
      :init-content="initContent"
      @focus="editorFocused = true"
      @blur="editorFocused = false"
      @change="handleChange"
      @onSave="handler.handleEditorSave"
    />
    <ToolBar
      ref="toolbarRef"
      :images="props.memo?.images"
      :submit-disabled="isEmpty(_memo?.content)"
      @add-emoji="handler.handleAddEmoji"
      @add-tag="handler.handleAddTag"
      @save="handler.handleEditorSave"
      @file-change="handler.handleFileChange"
    />
    <!-- 展示loading将其他隐藏 -->
    <div v-show="loading" class="loading-box">
      loading...
    </div>
  </div>
</template>

<style lang="scss" scoped>
.editor {
  border: 1px solid #e8e8e8;
  border: 1px solid rgba(232, 232, 232, 0.2);

  border-radius: 8px;
  padding: 10px;
  padding-bottom: 0;
  position: relative;
  @apply bg-base-fill;
  margin: 10px 0;
  &.focused  {
    box-shadow: 0 2px 10px #ddd;
    @apply ring-primary-light-2 dark:shadow-none;
  }
}
.loading-box {
  display: flex;
  height: 100%;
  width: 100%;
  background: var(--flomo-defalut-bg);
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
}

.loading {
  position: relative;

  .loading-box {
    visibility: visible;
  }
}
</style>
