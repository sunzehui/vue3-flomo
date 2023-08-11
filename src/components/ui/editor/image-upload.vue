<script lang="ts" setup>
import { computed, ref, unref, watch, watchEffect } from 'vue'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import { ElDialog, ElIcon, ElUpload } from 'element-plus'
import type { UploadFile, UploadFiles, UploadHooks, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus'
import { compress } from 'image-conversion'
import { ApiUploadFile } from '@/api/file'

const emit = defineEmits(['fileChange'])

const fileList = ref<UploadFiles>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fileIdList = ref<string[]>([])

const handleRemove = (file: UploadFile) => {
  const fileId = (file.response as any).data.id
  fileIdList.value.splice(fileIdList.value.indexOf(fileId), 1)
  emit('fileChange', unref(fileIdList))
  fileList.value.splice(fileList.value.indexOf(file), 1)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleFileChange: UploadHooks['onChange'] = (file, files) => {
  fileList.value = files
}
// 上传前进行图片压缩
const handleBeforeUpload = (rawFile: UploadRawFile): any => {
  return new Promise((resolve, reject) => {
    compress(rawFile, 0.4)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
const handleUpload: UploadProps['httpRequest'] = async (file) => {
  const res = await ApiUploadFile(file.file)

  return res
}
const handleUploadSuccess: UploadProps['onSuccess'] = async (res) => {
  fileIdList.value.push(res.data.id)
  emit('fileChange', unref(fileIdList))
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
