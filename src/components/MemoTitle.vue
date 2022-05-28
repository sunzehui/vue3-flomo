<script lang="ts" setup>
import { useArticleStore } from "@/store/article";
import { Refresh, Search, Edit } from "@element-plus/icons";
import { onMounted, reactive, ref } from "vue";
import Editer from "../components/Editer.vue";
import MemoCard from "../components/MemoCard.vue";
const tagName = ref("");
</script>

<template>
  <div class="title">
    <span> MEMO </span>
    <div style="display: inline" v-if="tagName.length">
      <span class="line">/</span>
      <b class="lastTag"
        ><span>
          <label>{{ tagName }}</label></span
        >
      </b>
      <Edit class="icon" />
    </div>
    <Refresh class="icon" />
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
.title > span {
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: #5f5f5f;
  @apply relative;
  svg {
    height: 14px;
    width: 14px;
  }
}
.lastTag {
  @apply mx-1 text-gray-500 text-base;
}
</style>
