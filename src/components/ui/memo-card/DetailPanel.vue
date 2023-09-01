<script lang="ts" setup>
import { computed, onUnmounted, ref, unref } from 'vue'
import { useClipboard, useEventBus } from '@vueuse/core'
import { ElButton, ElDrawer, ElMessage } from 'element-plus'
import Gallery from '@/components/ui/memo-card/gallery.vue'
import Tags from '@/components/ui/memo-card/tags.vue'
import { MEMO_CARD } from '@/common/event-bus'

const isShow = ref(false)
const memo = ref(null)
const { copy, text } = useClipboard()

async function copyMemo() {
  if (!memo.value)
    return
  try {
    await copy(memo.value.content || '')
    const copied = unref(text)
    // 超过30字符，截断，...
    const showText = copied.length > 30 ? `${copied.slice(0, 30)}...` : copied
    ElMessage.success(`copied: ${showText}`)
  }
  catch (error) {
    ElMessage.error('sorry, 你的浏览器不支持复制，请手动复制！')
  }
}
const { on, off } = useEventBus(MEMO_CARD)
const eventHandler = (evt, payload) => {
  if (evt.action === 'open-detail-card')
    isShow.value = true
  memo.value = payload
}
on(eventHandler)
onUnmounted(() => {
  off(eventHandler)
})

const memoContent = computed(() => {
  return memo.value.content || '额，好像什么都没有！'
})
defineExpose({
  open,
})
</script>

<template>
  <ElDrawer v-model="isShow" custom-class="detail-drawer !w-8/12 md:!w-6/12 lg:!w-4/12" :lock-scroll="false">
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
    <span class="memo-content" v-html="memoContent" />
    <Gallery :images="memo.images" />
    <Tags :tags="memo.tags" class="mt-3" />
  </ElDrawer>
</template>

<style lang="scss" scoped>
.memo-content{
  @apply break-all py-0 whitespace-pre-line;
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
