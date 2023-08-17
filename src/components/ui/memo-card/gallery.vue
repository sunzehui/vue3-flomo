<script lang="ts" setup>
import { ElIcon, ElImage } from 'element-plus'
import { computed, unref } from 'vue'
import { ZoomIn } from '@element-plus/icons-vue'
import type { FileRecord } from '@/types/article'

const props = defineProps<{
  images: FileRecord[]
}>()

const previewList = computed(() => {
  return unref(props.images).map((item: FileRecord) => item.filePath)
})
</script>

<template>
  <div class="img-container">
    <div v-for="(file, idx) in images" :key="file.id" class="relative imgwrp">
      <ElImage
        class="el-upload-list__item-thumbnail rounded-sm"
        :src="file.filePath"
        :zoom-rate="1"
        hide-on-click-modal
        :preview-src-list="previewList"
        :initial-index="idx"
        fit="cover"
      />
      <span
        class="el-upload-list__item-actions pointer-events-none"
      >
        <span
          class="el-upload-list__item-preview"
        >
          <ElIcon><ZoomIn /></ElIcon>
        </span>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.img-container{
  @apply my-2 flex justify-start flex-wrap gap-2;
}
.imgwrp{
      --el-upload-picture-card-size: 80px;
      height: var(--el-upload-picture-card-size);
      width: var(--el-upload-picture-card-size);
  margin: 0;
  @apply rounded-sm overflow-hidden;
  &:hover .el-upload-list__item-actions{
    @apply opacity-60 duration-300 transition-opacity;
  }

}
.el-upload-list__item-actions{
    @apply absolute inset-0 h-full w-full flex justify-center items-center opacity-0 bg-slate-300 ;
  }
</style>
