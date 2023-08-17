<script lang="ts" setup>
import { computed, ref, unref, watch, watchEffect } from 'vue'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import { ElDialog, ElIcon, ElMessage, ElUpload } from 'element-plus'
import type { UploadFile, UploadFiles, UploadHooks, UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus'
import { compress } from 'image-conversion'
import { ApiIsFileExist, ApiUploadFile } from '@/api/file'
import { calculateMD5 } from '@/utils/file'

const emit = defineEmits(['fileChange'])

const fileList = ref<UploadFiles>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fileIdList = ref<string[]>([])
const fileIdAndUUid = new Map()

const uploadRef = ref<UploadInstance>()

const submitUpload = () => {
  uploadRef.value!.submit()
}
const handleRemove = (file: UploadFile) => {
  const fileId = fileIdAndUUid.get(file.uid)
  // const fileId = (file.response as any).data.id
  fileIdList.value.splice(fileIdList.value.indexOf(fileId), 1)
  emit('fileChange', unref(fileIdList))
  fileList.value.splice(fileList.value.indexOf(file), 1)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const isValidImageType = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  return allowedTypes.includes(file.type)
}

const isValidImageSize = (file) => {
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  return file.size <= maxSize
}
const checkFileExistOnServer = async (file: File) => {
  // Replace with your API call to check if file exists on the server
  const md5 = await calculateMD5(file)
  return await ApiIsFileExist(md5)
}

const handleUploadSuccess = async (res, file) => {
  fileIdAndUUid.set(file.uid, res.data.id)
  fileIdList.value.push(res.data.id)
  emit('fileChange', unref(fileIdList))
}
const handleUpload = async (file) => {
  try {
    const res = await ApiUploadFile(file.raw)
    if (res.code === 0)
      handleUploadSuccess(res, file)
  }
  catch (e) {
    handleRemove(file)
  }
}
const handleFileChange: UploadHooks['onChange'] = async (file, files) => {
  const compressedFile = file.raw
  const isFileExist = await checkFileExistOnServer(compressedFile)
  if (isFileExist.data) {
    // File already exists on the server
    handleUploadSuccess(isFileExist, file) // Call the success callback directly
    return false // Cancel upload
  }
  await handleUpload(file)
  fileList.value = files
}
const handleBeforeUpload = async (rawFile: UploadRawFile) => {
  const isImage = isValidImageType(rawFile)
  const isSizeValid = isValidImageSize(rawFile)

  if (!isImage) {
    ElMessage.error('请选择有效的图片文件')
    return false
  }
  else if (!isSizeValid) {
    ElMessage.error('图片大小不能超过 5MB')
    return false
  }
  return await compress(rawFile, 0.4) as File
}

defineExpose({
  clear() {
    fileList.value = []
    fileIdList.value = []
    emit('fileChange', unref(fileIdList))
  },
})
</script>

<template>
  <div class="image-upload-wrp">
    <ElUpload
      list-type="picture-card"
      action=""
      :http-request="handleUpload"
      :file-list="fileList"
      :auto-upload="false"
      :before-upload="handleBeforeUpload"
      :on-change="handleFileChange"
      :on-success="handleUploadSuccess"
    >
      <ElIcon><Plus /></ElIcon>

      <template #file="{ file }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
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
        </div>
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
