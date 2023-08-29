<script setup lang="ts">
import { inject, ref, watchEffect } from 'vue'

import { isEmpty } from 'lodash-es'
import EmojiPicker from 'vue3-emoji-picker'
import { EditorType } from '@/types/card-type'
import ImageUpload from '@/components/ui/editor/image-upload.vue'
import { useMemoEditor } from '@/composable/useMemoEditor'
import 'vue3-emoji-picker/css'

const emit = defineEmits([
  'addTag',
  'addEmoji',
  'addImage',
  'fileChange',
  'save',
])

const {
  handler: {
    handleAddEmoji,
    handleAddTag,
  },
  memo,
  editorType,
} = useMemoEditor()

const imageUploadRef = ref(null)

const isImgUploadShow = ref(false)
const handleAddImage = (event: MouseEvent) => {
  isImgUploadShow.value = !isImgUploadShow.value
}
const handleFileChange = (file: File) => {
  emit('fileChange', file)
}
defineExpose({
  clearImages: () => {
    imageUploadRef.value?.clear()
  },
})
</script>

<template>
  <ImageUpload
    v-if="isImgUploadShow"
    ref="imgUploadRef"
    @fileChange="handleFileChange"
  />
  <div class="bar">
    <span class="item icon-tag" @click="handleAddTag"> 🔗 </span>
    <span class="item icon-emoji" @click="handleAddEmoji"> 😀 </span>
    <span class="item icon-emoji" @click="handleAddImage">🖼️</span>

    <button
      class="save"
      :disabled="isEmpty(memo?.content)"
      @click.prevent="emit('save')"
    >
      {{ editorType === EditorType.edit ? '保存' : '发送' }}
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
</style>