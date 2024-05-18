<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { isEmpty } from 'lodash-es'
import EmojiPicker from './emoji-picker.vue'
import { EditorType } from '@/types/card-type'
import ImageUpload from '@/components/ui/editor/image-upload.vue'
import { useMemoEditor } from '@/composable/useMemoEditor'
import type { FileRecord } from '@/types/memo'

const props = withDefaults(defineProps<{
  submitDisabled: boolean
  images?: FileRecord[]
}>(), {
  submitDisabled: true,
})
const emit = defineEmits([
  'addTag',
  'addEmoji',
  'addImage',
  'fileChange',
  'save',
])
const {
  editorType,
} = useMemoEditor()

const imageUploadRef = ref(null)

const isImgUploadShow = ref(false)
watchEffect(() => {
  isImgUploadShow.value = !isEmpty(props.images)
})
const handleAddImage = (event: MouseEvent) => {
  isImgUploadShow.value = !isImgUploadShow.value
}
const handleFileChange = (file: File) => {
  emit('fileChange', file)
}
const handleAddEmoji = (emoji) => {
  emit('addEmoji', emoji)
}
const handleAddTag = () => {
  emit('addTag')
}
const isPickerOpen = ref(false)
const openEmojiPicker = () => {
  isPickerOpen.value = true
}
defineExpose({
  clearImages: () => {
    imageUploadRef.value?.clear()
    isImgUploadShow.value = false
  },
})
</script>

<template>
  <ImageUpload
    v-if="isImgUploadShow"
    ref="imageUploadRef"
    :images="props.images"
    @fileChange="handleFileChange"
  />
  <EmojiPicker
    v-model="isPickerOpen"
    @picked="handleAddEmoji"
  />
  <div class="bar">
    <span class="item icon-tag" @click="handleAddTag"> 🔗 </span>
    <span class="item icon-emoji" @click="openEmojiPicker"> 😀 </span>
    <span class="item icon-image" @click="handleAddImage">🖼️</span>

    <button
      class="save"
      :disabled="props.submitDisabled"
      @click.prevent="emit('save')"
    >
      {{ editorType == EditorType.create ? '保存' : '发送' }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
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
    @apply bg-primary ring-primary-light-3 text-light-text;
    font-size: 12px;
    display: inline-block;
    line-height: 12px;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    @apply dark:border-0;
    -webkit-appearance: none;
    appearance: none;
    text-align: center;
    box-sizing: border-box;
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
      @apply bg-disabled text-light-text dark:border-0;
    }
  }
}
</style>
