<script lang="ts" setup>
import { ApiTagRename } from "@/api/article";
import { Refresh, Search, Check, Edit } from "@element-plus/icons";
import { useToggle } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { computed, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();

const tagName = computed(() => route.query.tag as string) || ref("");
const bindTagName = ref("");
watchEffect(() => {
  bindTagName.value = route.query.tag as string;
});
const router = useRouter();
const goRouter = (query = void 0) => {
  router.push({
    name: "memo",
    query,
  });
};
const [isTagEdit, toggeEdit] = useToggle(false);
const rename = () => {
  ApiTagRename(tagName.value, bindTagName.value).then((res) => {
    ElMessage.success("修改成功");
    isTagEdit.value = false;
    goRouter({
      tag: bindTagName.value,
    });
  });
};
</script>

<template>
  <div class="title-wrp">
    <span @click.prevent="goRouter()" class="title"> MEMO </span>
    <div style="display: inline" v-if="tagName">
      <span class="line">/</span>
      <input
        type="text"
        class="tagEdit"
        v-model="bindTagName"
        v-show="isTagEdit"
      />

      <b class="lastTag" v-show="!isTagEdit">
        <span
          ><label>{{ tagName }}</label></span
        >
      </b>
      <Edit
        class="icon"
        v-show="!isTagEdit"
        @click.prevent="isTagEdit = true"
      />
      <Check class="icon" v-show="isTagEdit" @click.prevent="rename" />
    </div>
    <Refresh class="icon" @click.prevent="goRouter()" />
  </div>
</template>

<style lang="scss" scoped>
.icon {
  font-style: normal;
  height: 14px;
  width: 14px;
  display: inline-block;
  margin-top: -5px;
  margin-right: 5px;
  opacity: 0.8;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
}
span > label {
  font-weight: bold;
  color: #5f5f5f;
}
.line {
  opacity: 0.5;
  @apply mx-1;
}
.title-wrp > span.title {
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: #5f5f5f;
  cursor: pointer;
  border-radius: 3px;
  @apply relative;
  svg {
    height: 14px;
    width: 14px;
  }
  &:hover {
    background: rgba(55, 53, 47, 0.08);
  }
}

.tagEdit {
  display: inline-block;
  width: 120px;
  height: 30px;
  border-radius: 4px;
  margin-right: 5px;
}
.lastTag {
  @apply mx-1 text-gray-500 text-base;
}
</style>
