<script lang="ts" setup>
import { toRefs } from "vue";
const props = defineProps<{
  username: string;
  isPro: boolean;
}>();
const { username, isPro } = toRefs(props);
</script>

<template>
  <div class="user">
    <span class="username">
      <span class="title">{{ username }}</span
      ><span class="pro" :class="{ active: isPro }">PRO</span>
    </span>
    <div class="icons">
      <div class="notify mr-2">
        <svg
          data-v-356cff01=""
          width="18"
          height="18"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            data-v-356cff01=""
            width="48"
            height="48"
            fill="white"
            fill-opacity="0.01"
          ></rect>
          <path
            data-v-356cff01=""
            d="M24 4C16.268 4 10 10.268 10 18V38H38V18C38 10.268 31.732 4 24 4Z"
            fill="none"
          ></path>
          <path
            data-v-356cff01=""
            d="M10 38V18C10 10.268 16.268 4 24 4C31.732 4 38 10.268 38 18V38M4 38H44"
            stroke="#808080"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            data-v-356cff01=""
            d="M24 44C26.7614 44 29 41.7614 29 39V38H19V39C19 41.7614 21.2386 44 24 44Z"
            fill="none"
            stroke="#808080"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </div>
      <div class="setting">
        <svg
          data-v-356cff01=""
          width="20"
          height="20"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            data-v-356cff01=""
            width="48"
            height="48"
            fill="white"
            fill-opacity="0.01"
          ></rect>
          <path
            data-v-356cff01=""
            d="M34.0003 41L44 24L34.0003 7H14.0002L4 24L14.0002 41H34.0003Z"
            fill="none"
            stroke="#808080"
            stroke-width="3"
            stroke-linejoin="round"
          ></path>
          <path
            data-v-356cff01=""
            d="M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z"
            fill="none"
            stroke="#808080"
            stroke-width="3"
            stroke-linejoin="round"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user {
  @apply flex py-3 items-center;
  .username {
    flex: 1;
    cursor: pointer;
    font-weight: bold;
    font-size: 18px;
    color: #5f5f5f;
    .title {
      max-width: 120px;
      display: inline-block;
      overflow: hidden;
    }
    .pro {
      color: white;
      background: #9d9d9d;
      font-size: 12px;
      padding: 2px 4px;
      border-radius: 4px;

      display: inline-block;
      position: relative;
      bottom: 8px;
      cursor: pointer;
      @apply mx-1;
      &.active {
        background: #212f4b;
      }
    }
  }
  .icons {
    @apply flex items-center gap-2;
  }
  .notify,
  .setting {
    cursor: pointer;
  }
}
</style>
