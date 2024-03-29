<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { isEmpty } from 'lodash-es'
import Editor from './text-editor.vue'
import ToolBar from './toolbar.vue'
import { EditorType } from '@/types/card-type'
import type { Memo } from '@/types/memo'
import { useMemoEditor } from '@/composable/useMemoEditor'
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

onMounted(() => {
  registerComponentRef(editorRef, toolbarRef)
  // 编辑时会传入memo信息
  setEditorConfig({
    type: props.type,
    memo: props.memo,
  })
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
      @change="handler.handleEditorChange"
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
