<script lang="ts" setup>
import { computed, onUnmounted, ref, unref } from 'vue'
import { ElDialog, ElLoading, ElMessage } from 'element-plus'
import { toCanvas as img2Canvas } from 'html-to-image'
import dayjs from 'dayjs'
import { useEventBus } from '@vueuse/core'
import Gallery from './memo-card/gallery.vue'
import { MEMO_CARD } from '@/common/event-bus'
import { localTime } from '@/utils/time'

const memoRef = ref(null)
const imgUrl = ref(null)
const memoShow = ref(false)
const memoData = ref(null)
let loadingService = null

const createTime = computed(() => {
  const memo = unref(memoData)
  if (!memo)
    return
  return dayjs(memo.createTime).format('YYYY-MM-DD HH:mm:ss')
})
const htmlContent = computed(() => {
  const memo = unref(memoData)
  if (!memo)
    return
  return memo.content.replace(/\n/g, '<br />')
})

const handleOpenShare = async () => {
  const node = unref(memoRef)
  img2Canvas(node, {
    pixelRatio: window.devicePixelRatio * 2,
    backgroundColor: '#eaeaea',
    preferredFontFormat: 'opentype',
  })
    .then(canvas => canvas.toDataURL())
    .then((url) => {
      imgUrl.value = url
    })
    .catch((error) => {
      console.error('oops, something wents wrong!', error)
      ElMessage.error('生成失败')
      imgUrl.value = null
    }).finally(() => {
      loadingService.close()
    })
}
const { on, off } = useEventBus(MEMO_CARD)
const eventHandler = (evt, payload) => {
  if (evt.action === 'open-share-card') {
    memoData.value = payload
    memoShow.value = true
    loadingService = ElLoading.service({
      lock: true,
      text: '生成中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    setTimeout(() => {
      handleOpenShare()
    }, 200)
  }
}
on(eventHandler)
onUnmounted(() => {
  off(eventHandler)
})

const handleClose = () => {
  imgUrl.value = null
  memoData.value = null
}
</script>

<template>
  <ElDialog v-model="memoShow" width="380px" @close="handleClose">
    <header>
      <span class="title">分享🙌</span>
      <span class="sub-title">[👇长按保存图片]</span>
    </header>
    <div ref="memoRef" class="memo">
      <img v-if="imgUrl" :src="imgUrl" alt="img" class="absolute">
      <div class="content">
        <span class="time">{{ localTime(createTime) }}</span>
        <span v-html="htmlContent" />
        <div class="gallery-container">
          <img
            v-for="item in memoData.images" :key="item.id" crossorigin="anonymous"
            :src="item.filePath" alt=""
            class="rounded-sm"
          >
        </div>
      </div>

      <footer>
        <span class="statistics">
          <span class="num">0</span>
          Day /
          <span class="num">0</span>
          Memos</span>

        <span class="">✍️ by <b>{{ memoData?.user?.nickname }}</b></span>
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
.memo-view .el-overlay{
  z-index: 1000 !important;
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

.content {
  display: flex;
  flex-direction: column;
  text-align: left;
  // padding: 0 20px;
  background: white;

  font-size: 20px;
  @apply py-3 px-3 w-full font-wenkai;
  span.time {
    color: #5f6775;
    @apply text-sm font-thin;

    font-size: 14px;
    color: #999;
    font-weight: 400;
  }
}
.gallery-container{
  height: 80px;
  display: flex;
  box-sizing: content-box;
  padding: 5px 2px;
  img{
    height: 80px;
    width: 80px;
    margin-right: 10px;
  }
}
footer {
  background-color: rgb(229, 231, 235);
  width: 100%;
  box-sizing: border-box;
  @apply px-3 py-3 text-base flex justify-between;
  span.statistics {
    color: #5f6775;
    @apply text-sm font-thin;

    font-size: 14px;
    color: #999;
    font-weight: 400;
    .num{
      color: #333;
    }
  }
}
</style>