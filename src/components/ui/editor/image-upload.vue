<script lang="ts" setup>
import { ref, unref, watchEffect } from 'vue'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import { ElDialog, ElIcon, ElMessage, ElUpload } from 'element-plus'
import type { UploadFile,  UploadHooks, UploadRawFile, UploadUserFile } from 'element-plus'
import { ApiUploadFile, checkFileExistOnServer } from '@/api/file'
import { compress, isValidImageSize, isValidImageType } from '@/utils/file'
import type { FileRecord } from '@/types/memo'
import { useUserStore } from '@/store/user'
import { deleteImage, isLocalImage, putImage } from '@/utils/localImages'

const props = defineProps<{
  images?: FileRecord[]
}>()

const emit = defineEmits(['fileChange'])

const fileList = ref<UploadUserFile[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fileIdList = ref<string[]>([])
const fileId2ResId = new Map()

const isLocalMode = () => !useUserStore().isAuthenticated

watchEffect(() => {
  if (!props.images)
    return

  // 本地模式的图片引用存放在 filePath（idb://key），服务端模式存数字 id
  fileList.value = props.images.map(item => ({
    name: `${item.id}`, url: item.filePath,
  }))
  fileIdList.value = props.images.map(item =>
    isLocalImage(item.filePath) ? item.filePath : `${item.id}`,
  )
  emit('fileChange', unref(fileIdList))
})

const handleRemove = (file: UploadFile) => {
  const resId = fileId2ResId.get(file.uid) ?? `${file.name}`

  // 本地模式：同步清理 IndexedDB 里的图片
  if (isLocalImage(resId))
    deleteImage(resId)

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

function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/** 本地模式：压缩后存入 IndexedDB，memo 里只保留 idb:// 引用 */
const handleLocalUpload = async (rawFile: UploadRawFile, fileUid: number) => {
  const compressed = await compress(rawFile, 0.4)
  const dataUrl = await fileToDataUrl(compressed)
  const src = await putImage(dataUrl)
  // 预览直接用 dataURL，避免再次读 IDB
  const entry = fileList.value.find(f => f.uid === fileUid)
  if (entry) {
    entry.url = dataUrl
    entry.name = src
  }
  fileId2ResId.set(fileUid, src)
  fileIdList.value.push(src)
  emit('fileChange', unref(fileIdList))
}

const validateImage = (rawFile?: UploadRawFile | Blob) => {
  if (!rawFile || !isValidImageType(rawFile)) {
    ElMessage.error('请选择有效的图片文件')
    return false
  }
  if (!isValidImageSize(rawFile)) {
    ElMessage.error('图片大小不能超过 5MB')
    return false
  }
  return true
}

const handleBeforeUpload = async (rawFile: UploadRawFile) => {
  if (!validateImage(rawFile))
    return null
  return await compress(rawFile, 0.4)
}
const handleFileChange: UploadHooks['onChange'] = async (file, files) => {
  // 本地模式：不经过服务端，图片压缩后入 IndexedDB
  if (isLocalMode()) {
    if (!validateImage(file.raw)) {
      fileList.value = fileList.value.slice(0, fileList.value.length - 1)
      return false
    }
    try {
      await handleLocalUpload(file.raw, file.uid)
    }
    catch {
      ElMessage.error('图片保存失败')
      fileList.value = fileList.value.slice(0, fileList.value.length - 1)
    }
    return false
  }
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
