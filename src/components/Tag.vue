<template>
  <span class="tag" @click="handleClick($event)">
    <svg
      class="sharp-icon"
      data-v-9eff3224=""
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        data-v-9eff3224=""
        opacity="0.01"
        width="18"
        height="18"
        fill="currentColor"
      ></rect>
      <path
        data-v-9eff3224=""
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.153 7.5L5.838 10.5H3V12H5.6805L5.28675 15.75H6.795L7.18875 12H10.1805L9.78675 15.75H11.295L11.6888 12H15V10.5H11.847L12.162 7.5H15V6H12.3195L12.7133 2.25H11.205L10.8113 6H7.8195L8.21325 2.25H6.705L6.31125 6H3V7.5H6.153ZM10.3387 10.5H7.34625L7.66125 7.5H10.6537L10.3387 10.5Z"
        fill="currentColor"
      ></path>
    </svg>
    <label>
      <slot />
    </label>
    <ArrowRight class="right-arrow-icon" style="height: 1em; width: 1em" />
  </span>
</template>
<script setup lang="ts">
import { inject } from "vue";
import { ArrowRight } from "@element-plus/icons";
const props = defineProps<{
  link: string;
}>();
const updateQuery = inject("updateQuery", (...args) => {});
const handleClick = () => {
  updateQuery({
    tag: props.link,
  });
};
</script>
<style lang="scss" scoped>
span.tag {
  line-height: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  .sharp-icon {
    display: inline-block;
    margin-right: 6px;
    padding-bottom: 0px;
  }
  svg {
    display: inline-block;
  }
  position: relative;
  .right-arrow-icon {
    position: absolute;
    right: 10px;
  }
  &:hover {
    background: #efefef;
    border-radius: 5px;
    color: #9d9d9d;
  }
}
</style>
