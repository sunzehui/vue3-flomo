<script lang="ts" setup>
import { computed, PropType } from "vue";
import { ElDialog, ElDivider } from "element-plus";
import { Memo } from "@/types/memo";
import { onMounted } from "vue";

import * as htmlToImage from "html-to-image";
import { ref, watch, unref } from "vue";
import { nextTick } from "vue";
const props = defineProps({
  content: {
    type: Object as PropType<Memo>,
  },
  show: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:show"]);
const show = computed({
  get: () => props.show,
  set: (val) => emit("update:show", val),
});
const memoRef = ref(null);
const imgUrl = ref(null);
console.log(props.content);
const memo = computed(() => props.content);
onMounted(async () => {
  if (!show) return;
  await nextTick();
  const node = unref(memoRef);
  if (!node) return;

  htmlToImage
    .toCanvas(node, {
      pixelRatio: window.devicePixelRatio * 2,
      backgroundColor: "#eaeaea",
    })
    .then((canvas) => canvas.toDataURL())
    .then((url) => {
      imgUrl.value = url;
    })
    .catch(function (error) {
      console.error("oops, something wents wrong!", error);
    });
});
</script>
<template>
  <ElDialog v-model="show" title="🙌 分享" width="380px">
    <header>
      <span class="sub-title">👇 长按保存图片</span>
    </header>
    <div class="memo" ref="memoRef">
      <img :src="imgUrl" alt="img" v-if="imgUrl" class="absolute" />
      <div class="content">
        <span class="time">{{ memo.createTime }}</span>
        <span> {{ memo.content }} </span>
      </div>
      <footer>
        ✍️ by <b>{{ memo.user.username }}</b>
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
</style>
<style lang="scss" scoped>
header {
  @apply pb-2 pl-5;
  border-bottom-width: 1px;
  border-style: solid;
  border-color: #e5e7eb;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 0 20px;
  background: white;
  @apply pb-2;
  span.time {
    font-weight: thin;
    display: block;
    color: #5f6775;
    @apply mt-3 mb-1 text-sm;
  }
}
footer {
  background-color: rgb(229, 231, 235);
  width: 100%;
  box-sizing: border-box;
  @apply pl-5 py-3 text-base;
}
</style>
