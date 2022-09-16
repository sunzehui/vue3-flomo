<script lang="ts" setup>
import {defineComponent, reactive, ref, unref} from "vue";
import {reactify, useClipboard} from "@vueuse/core";
import {ElButton, ElDrawer, ElMessage} from "element-plus";
import {computed} from "vue";

const props = defineProps({
  content: {
    default: "",
    type: String,
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

const {copy, text} = useClipboard();

const open = () => {
  show.value = true;
};

async function copyMemo() {
  try {
    await copy(props.content || "");
    ElMessage.success(`copied: ${unref(text)}`);
  } catch (error) {
    ElMessage.error("sorry, 你的浏览器不支持复制，请手动复制！");
  }
}

defineExpose({
  open,
});
</script>

<template>
  <ElDrawer v-model="show" custom-class="detail-drawer" :lock-scroll="false">
    <template #header>
      <h4>MEMO</h4>
    </template>
    <template #footer>
      <div style="flex: auto">
        <ElButton @click="copyMemo">复制</ElButton>
      </div>
    </template>
    <span>{{ props.content || "额，好像什么都没有！" }}</span>
  </ElDrawer>
</template>
<style>
.detail-drawer {
  @apply w-8/12 !important;
  @apply md:w-6/12 !important;
  @apply lg:w-4/12 !important;
}
</style>
