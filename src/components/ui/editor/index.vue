<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
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
  memo,
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
</script>

<template>
  <div class="editor" :class="{ focused: editorFocused }">
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
      :submit-disabled="isEmpty(memo?.content)"
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
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  padding: 10px;
  padding-bottom: 0;
  position: relative;
  background: #fff;
  margin: 10px 0;
  &.focused  {
    border-color: #aaddc6;
    box-shadow: 0 2px 10px #ddd;
  }
}
.loading-box {
  display: flex;
  height: 100%;
  width: 100%;
  background: white;
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
