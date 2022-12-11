<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { isEmpty } from 'lodash'
import { ElMessage } from 'element-plus'
import { useSuggestion } from '@/composable/useSuggestion'
import { useArticleStore } from '@/store/article'
import { useEditor } from '@/composable/useEditor'
import { extractTags } from '@/utils/editor'
import type { Memo } from '@/types/memo'
import { EditorType } from '@/types/card-type'

const props = defineProps<{
  memo?: Memo
  type: EditorType
}>()

const suggestionRef = ref(null)

// 监听onkeydown
const textareaRef = ref(null)
const editor = useEditor(textareaRef, {
  onSave: () => handleSave(),
  type: props.type,
})
const {
  textareaContent,
  shouldSuggestionShow,
  handleIconClick,
  handleItemClick,
  suggestionList,
} = useSuggestion(suggestionRef, editor)

onMounted(() => {
  if (props.memo && props.type === EditorType.edit)
    editor.insertContent(props.memo?.content || '')
})

const articleStore = useArticleStore()
const buildArticle = () => {
  const tags = extractTags(textareaContent.value)
  const article: Partial<Memo> = {
    tags,
    content: textareaContent.value,
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
  articleStore.update(id, article).then((result) => {
    loading.value = false
  })
}
const saveArticle = () => {
  const article = buildArticle()
  loading.value = true
  articleStore.save(article).then((result) => {
    loading.value = false
    textareaContent.value = ''
  })
}
const handleSave = () => {
  if (props.type === EditorType.create)
    saveArticle()

  else if (props.type === EditorType.edit)
    updateArticle()
}

const loading = ref(false)
</script>

<template>
  <div class="editor">
    <textarea
      ref="textareaRef"
      v-model="textareaContent"
      name="text-input"
    />
    <transition name="fade">
      <div
        v-show="shouldSuggestionShow"
        ref="suggestionRef"
        class="suggestion"
        @click="handleItemClick($event)"
      >
        <template v-for="item of suggestionList">
          <span :class="{ active: item.active }">{{ item.content }}</span>
        </template>
      </div>
    </transition>

    <div class="bar">
      <span class="tag-icon" @click="handleIconClick($event)"> # </span>
      <button
        class="save"
        :disabled="isEmpty(textareaContent)"
        @click.prevent="handleSave"
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
  // padding-top: 20px;
  position: relative;
  background: #fff;
  margin: 10px 0;
}

textarea {
  border: none;
  outline: 0;
  height: 42px;
  // padding: 0 10px;
  padding: 0;
  box-sizing: border-box;
  resize: none;
  min-height: 42px;
  max-height: 50vh;
  width: 100%;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent !important;
  }

  min-height: 1rem;

  &:focus {
    outline: 0;
    box-shadow: none;
  }
}

.suggestion {
  position: absolute;
  background-color: black;
  max-width: 350px;
  padding: 5px;
  z-index: 99;
  border-radius: 5px;
  display: flex;
  flex-direction: column;

  &.hidden {
    display: none;
  }

  span {
    color: white;
    padding: 3px 20px;
    margin-bottom: 4px;
    white-space: nowrap;
    border-radius: 6px;
    cursor: pointer;
    user-select: none;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }

  &.show {
    display: block;
  }
}

.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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

  .tag-icon {
    display: inline-block;
    // margin-left: 20px;
    font-size: 0.9em;
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
