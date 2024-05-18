<script lang="ts" setup>
import { ref, unref, watchEffect } from 'vue'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import { ElDialog, ElIcon, ElMessage, ElUpload } from 'element-plus'
import type { UploadFile,  UploadHooks, UploadRawFile, UploadUserFile } from 'element-plus'
import { ApiUploadFile, checkFileExistOnServer } from '@/api/file'
import { compress, isValidImageSize, isValidImageType } from '@/utils/file'
import type { FileRecord } from '@/types/memo'
const props = defineProps<{
  images?: FileRecord[]
}>()

const emit = defineEmits(['fileChange'])

const fileList = ref<UploadUserFile[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fileIdList = ref<string[]>([])
const fileId2ResId = new Map()

watchEffect(() => {
  if (!props.images)
    return

  fileList.value = props.images.map(item => ({
    name: `${item.id}`, url: item.filePath,
  }))
  fileIdList.value = props.images.map(item => `${item.id}`)
  emit('fileChange', unref(fileIdList))
})

const handleRemove = (file: UploadFile) => {
  const resId = fileId2ResId.get(file.uid)

  // 清除id数据
  const removeFileId = fileIdList.value.indexOf(resId)
  fileIdList.value.splice(removeFileId, 1)
  emit('fileChange', unref(fileIdList))
  // 清除界面显示
  const removeShowFileIdx = fileList.value.findIndex(f => f.uid === file.uid)
  fileList.value.splice(removeShowFileIdx, 1)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const pushFiles = async (resId, fileUid) => {
  fileId2ResId.set(fileUid, resId)
  fileIdList.value.push(resId)
  emit('fileChange', unref(fileIdList))
}
const handleUpload = async (fileRaw, fileUid) => {
  const res = await ApiUploadFile(fileRaw)
  if (res.code === 0)
    pushFiles(res.data.id, fileUid)
}

const handleBeforeUpload = async (rawFile: UploadRawFile) => {
  const isImage = isValidImageType(rawFile)
  const isSizeValid = isValidImageSize(rawFile)
  

  if (!isImage) {
    ElMessage.error('请选择有效的图片文件')
    return null
  }
  else if (!isSizeValid) {
    ElMessage.error('图片大小不能超过 5MB')
    return null
  }
  
  return await compress(rawFile, 0.4)
}
const handleFileChange: UploadHooks['onChange'] = async (file, files) => {
  // 处理文件: 压缩、检查文件是否存在
  const compressedFile = await handleBeforeUpload(file.raw)
  if(!compressedFile) {
    fileList.value = fileList.value.slice(0, fileList.value.length - 1)
    return false
  }
  const isFileExist = await checkFileExistOnServer(compressedFile)
  if (isFileExist.data) {
    // File already exists on the server
    pushFiles(isFileExist.data.id, file.uid) // Call the success callback directly
    return false // Cancel upload
  }
  // 上传文件
  try{
    await handleUpload(compressedFile, file.uid)
  } catch(e){
    ElMessage.error('上传失败')
  } finally {
    fileList.value = files
  }
}

defineExpose({
  clear() {
    fileList.value = []
    fileIdList.value = []
    fileId2ResId.clear()
    emit('fileChange', unref(fileIdList))
  },
  setFiles(files: { url: string; name: string }[]) {
    fileList.value = files
  },
})
</script>

<template>
  <div class="image-upload-wrp">
    <ElUpload
      v-model:fileList="fileList"
      list-type="picture-card"
      :auto-upload="false"
      :on-change="handleFileChange"
      :on-success="pushFiles"
    >
      <ElIcon><Plus /></ElIcon>

      <template #file="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="图片预览">
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <ElIcon><ZoomIn /></ElIcon>
          </span>

          <span
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <ElIcon><Delete /></ElIcon>
          </span>
        </span>
      </template>
    </ElUpload>

    <ElDialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image">
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped>
.image-upload-wrp{
    :deep(.el-upload--picture-card){
      --el-upload-picture-card-size: 80px;
    }
    :deep(.el-upload-list--picture-card){
      --el-upload-list-picture-card-size: 80px;
    }
  }
</style>
