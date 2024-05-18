<script lang="ts" setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import SuggestionList from './suggestion-list.vue'
import { useSuggestion } from '@/composable/useSuggestion'
import type { Memo, tagType } from '@/types/memo'
import type { EditorType } from '@/types/card-type'

const props = defineProps<{
  type: EditorType
  suggestionList: tagType[]
  initContent?: string
}>()
const emit = defineEmits(['change', 'onSave', 'focus', 'blur'])

const suggestionRef = ref(null)
// 监听onkeydown
const textareaRef = ref(null)

const {
  isSuggestionShow,
  handleItemClick,
  suggestionList,
  editor: { insertContent, onSave, textareaContent, resize, blur },
  clear,
} = useSuggestion({
  suggestionRef,
  editorRef: textareaRef,
  suggestionList: computed(() => props.suggestionList),
})

onSave(() => {
  emit('onSave')
})
onMounted(() => {
  if (props.initContent)
    insertContent(props.initContent)
})
defineExpose({
  clear() {
    textareaContent.value = ''
    clear()
  },
  insertContent,
  getContent() {
    return textareaContent.value
  },
  setContent(content: string) {
    textareaContent.value = content
  },
  getType() {
    return props.type
  },
  resize,
  blur: () => {
    blur()
    emit('blur')
  },
})
watch(textareaContent, () => {
  emit('change', textareaContent.value)
})
watchEffect(() => {
  // 默认选中第一个
  if (suggestionList.value.length > 0) {
    suggestionList.value.map(item => item.active = false)
    suggestionList.value[0].active = true
  }
})
</script>

<template>
  <textarea
    ref="textareaRef"
    v-model="textareaContent"
    placeholder="memo input here..."
    name="text-input"
    @focus="emit('focus')"
    @blur="emit('blur')"
  />
  <SuggestionList
    ref="suggestionRef"
    :show="isSuggestionShow"
    :list="suggestionList"
    @itemClick="handleItemClick"
  />
</template>

<style lang="scss" scoped>
textarea {
  border: none;
  outline: 0;
  min-height: 42px;
  height: auto;
  // padding: 0 10px;
  padding: 0;
  box-sizing: border-box;
  resize: none;
  min-height: 42px;
  max-height: 50vh;
  width: 100%;
  overflow-y: scroll;

  @apply bg-base-fill ;

  @apply text-primary-text ;
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
   ::placeholder{
    @apply text-placeholder;
  }
}
</style>
