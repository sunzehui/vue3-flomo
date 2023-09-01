<script lang="ts" setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
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
  shouldSuggestionShow,
  handleItemClick,
  suggestionList,
  editor: { insertContent, onSave, textareaContent },
} = useSuggestion({
  suggestionRef,
  editorRef: textareaRef,
  suggestionList: computed(() => props.suggestionList),
  editorCfg: {
    type: props.type,
  },
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
})
watch(textareaContent, () => {
  emit('change', textareaContent.value)
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
  <transition name="fade">
    <div
      v-show="shouldSuggestionShow"
      ref="suggestionRef"
      class="suggestion"
      @click="handleItemClick($event)"
    >
      <span v-for="item of suggestionList" :key="item.id" :class="{ active: item.active }">{{ item.content }}</span>
    </div>
  </transition>
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
  ::placeholder{
    color: #aaa;
  }
}

.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
