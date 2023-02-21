<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, nextTick, onMounted, ref, unref, watch, watchEffect } from 'vue'

import { ElDialog, ElLoading } from 'element-plus'
import { toCanvas as img2Canvas } from 'html-to-image'
import dayjs from 'dayjs'
import type { Memo } from '@/types/memo'
const props = defineProps({
  content: {
    type: Object as PropType<Memo>,
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

const memoRef = ref(null)
const imgUrl = ref(null)
const memo = computed(() => props.content)
const createTime = computed(() => dayjs(unref(memo).createTime).format('YYYY-MM-DD HH:mm:ss'))
watch(() => props.show, async () => {
  if (!show.value)
    return
  if (!unref(memoRef))
    await nextTick()
  const node = unref(memoRef)

  const loading = ElLoading.service({
    lock: true,
    text: '生成中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  img2Canvas(node, {
    pixelRatio: window.devicePixelRatio * 2,
    backgroundColor: '#eaeaea',
  })
    .then((canvas) => {
      return canvas.toDataURL()
    })
    .then((url) => {
      imgUrl.value = url
      loading.close()
    })
    .catch((error) => {
      console.error('oops, something wents wrong!', error)
    })
})
const htmlContent = computed(() => {
  return memo.value.content.replace(/\n/g, '<br />')
})
</script>

<template>
  <ElDialog v-model="show" width="380px">
    <header>
      <span class="title">分享🙌</span>
      <span class="sub-title">[👇长按保存图片]</span>
    </header>
    <div ref="memoRef" class="memo">
      <img v-if="imgUrl" :src="imgUrl" alt="img" class="absolute">
      <div class="content">
        <span class="time">{{ memo.createTime }}</span>
        <span v-html="htmlContent" />
      </div>
      <footer>
        <span class="time ">{{ createTime }}</span>
        <span class="">✍️ by <b>{{ memo.user.nickname }}</b></span>
      </footer>
    </div>
  </ElDialog>
</template>

<style>
.memo-view .el-dialog {
  border-radius: 10px;
  overflow: hidden;
}
.memo-view .el-dialog__body {
  padding: 0;
  border-radius: 10px;
}
.memo-view .el-dialog__header{
  padding: 0px;
}
</style>

<style lang="scss" scoped>
header {
  @apply py-2 pl-5;
  border-bottom-width: 1px;
  border-style: solid;
  border-color: #e5e7eb;
.title{
  font-weight: 500;
  font-size: 20px;
  color: #323232;
}
.sub-title{
  font-size: 14px;
  margin-left: 10px;
  color: #999;
  font-weight: 400;
}
}
@font-face {
  font-family: "wenkai";
  src: url("/fonts/LXGWWenKai-Light.ttf");
}
.content *{
  font-family: 'wenkai','PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  // padding: 0 20px;
  background: white;
  font-weight: normal;

  font-size: 20px;
  @apply py-3 px-3;
  span.time {
    font-weight: thin;
    display: block;
    color: #5f6775;
    @apply text-sm;

    font-size: 14px;
    color: #999;
    font-weight: 400;
  }
}
footer {
  background-color: rgb(229, 231, 235);
  width: 100%;
  box-sizing: border-box;
  @apply px-3 py-3 text-base flex justify-between;

}
</style>
