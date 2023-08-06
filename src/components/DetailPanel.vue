<script lang="ts" setup>
import { computed, defineComponent, reactive, ref, unref } from 'vue'
import { reactify, useClipboard } from '@vueuse/core'
import { ElButton, ElDrawer, ElMessage } from 'element-plus'

const props = defineProps({
  content: {
    default: '',
    type: String,
  },
  show: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:show'])
const show = computed({
  get: () => props.show,
  set: val => emit('update:show', val),
})

const { copy, text } = useClipboard()

const open = () => {
  show.value = true
}

async function copyMemo() {
  try {
    await copy(props.content || '')
    const copied = unref(text)
    // 超过30字符，截断，...
    const showText = copied.length > 30 ? `${copied.slice(0, 30)}...` : copied
    ElMessage.success(`copied: ${showText}`)
  }
  catch (error) {
    ElMessage.error('sorry, 你的浏览器不支持复制，请手动复制！')
  }
}

defineExpose({
  open,
})
</script>

<template>
  <ElDrawer v-model="show" custom-class="detail-drawer !w-8/12 md:!w-6/12 lg:!w-4/12" :lock-scroll="false">
    <template #header>
      <h4>MEMO</h4>
    </template>
    <template #footer>
      <div style="flex: auto">
        <ElButton @click="copyMemo">
          复制
        </ElButton>
      </div>
    </template>
    <span class="memo-content">{{ props.content || "额，好像什么都没有！" }}</span>
  </ElDrawer>
</template>

<style lang="scss" scoped>
.memo-content{
  @apply break-all py-0 whitespace-pre;
}
</style>

<style lang="scss">
.detail-drawer .el-drawer__body{
  @apply px-6 py-0;
}
.el-message__content{
  @apply break-all
}
</style>
