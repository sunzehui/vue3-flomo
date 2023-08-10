<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref, toRefs, watchEffect } from 'vue'
import Editor from './ui/Editor.vue'
import { extractTags } from '@/utils/editor'
import { EditorType } from '@/types/card-type'
import type { Article as Memo } from '@/types/article'
import { useArticleStore } from '@/store/article'

const props = defineProps<{
  memo?: Memo
  type: EditorType
}>()
const memo = reactive(props.memo || {
  content: '',
})

const loading = ref(false)
const articleStore = useArticleStore()
const editorRef = ref(null)
const { tagList } = toRefs(useArticleStore())

const handleEditorChange = (content: string) => {
  memo.content = content
}

const buildArticle = () => {
  const tags = extractTags(memo.content)
  const article: Partial<Memo> = {
    tags,
    content: memo.content,
  }
  return article
}

const updateArticle = () => {
  const article = buildArticle()
  const { memo: { id } } = props
  if (!id) {
    ElMessage.error('数据异常，请刷新')
    throw new Error('can \'t find article id!')
  }
  loading.value = true
  articleStore.update(id, article).finally(() => {
    loading.value = false
  })
}
const saveArticle = () => {
  const article = buildArticle()
  loading.value = true
  articleStore.save(article).then((result) => {
    loading.value = false
    editorRef.value.clear()
  }).finally(() => {
    loading.value = false
  })
}
const handleEditorSave = () => {
  memo.content = editorRef.value.getContent()
  if (props.type === EditorType.create)
    saveArticle()
  else if (props.type === EditorType.edit)
    updateArticle()
}

const handleAddTag = (event: MouseEvent) => {
  editorRef.value.insertContent('#')
}
const handleAddEmoji = (event: MouseEvent) => {
  editorRef.value.insertContent('😀')
}

const editorFocused = ref(false)
</script>

<template>
  <div class="editor" :class="{ focused: editorFocused }">
    <Editor
      ref="editorRef"
      v-model="memo.content"
      :suggestion-list="tagList"
      :type="type"
      :init-content="$props.memo?.content || ''"
      @focus="editorFocused = true"
      @blur="editorFocused = false"
      @change="handleEditorChange"
      @onSave="handleEditorSave"
    />

    <div class="bar">
      <span class="item icon-tag" @click="handleAddTag($event)"> # </span>
      <span class="item icon-emoji" @click="handleAddEmoji($event)"> # </span>
      <button
        class="save"
        :disabled="isEmpty(memo.content)"
        @click.prevent="handleEditorSave"
      >
        {{ type === EditorType.edit ? '保存' : '发送' }}
      </button>
    </div>
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

.bar {
  display: flex;
  width: 100%;
  height: 40px;
  padding: 0 10px;
  align-items: center;
  box-sizing: border-box;
  position: relative;

  span {
    cursor: pointer;
    user-select: none;
  }

  .item{
    margin-right: 8px;
  }

  button {
    position: absolute;
    right: 6px;
    bottom: 4px;
    border-color: #aaddc6;
    background: #55bb8e;
    color: #fff;
    font-size: 12px;
    display: inline-block;
    line-height: 12px;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: 0.1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding: 9px 15px;
    border-radius: 4px;

    &:disabled {
      cursor: not-allowed;
      background-color: #aaddc6;
      color: white;
    }
  }
}

.loading {
  position: relative;

  .loading-box {
    visibility: visible;
  }
}
</style>
