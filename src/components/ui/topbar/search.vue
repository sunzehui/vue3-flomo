<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { ref, unref } from 'vue'
import { useMemoStore } from '@/store/memo'
const {
  getMemoList,
} = useMemoStore()
const inputVal = ref('')

const onSearch = async () => {
  await getMemoList({
    content: unref(inputVal),
  })
}
</script>

<template>
  <div class="input-wrapper">
    <input
      v-model="inputVal"
      enterkeyhint="search"
      aria-placeholder="search memos..." placeholder="search memos..." type="text" @keyup.enter="onSearch"
    >
    <Search class="input-icon" />
  </div>
</template>

<style lang="scss" scoped>
.input-wrapper {
  max-width: 200px;
  position: relative;
  box-sizing: border-box;

  input {
    width: 100%;
    font-size: 14px;
    height: 100%;
    outline: 0;
    border: none;
    @apply bg-base-fill dark:bg-dark-base-fill;
    border-radius: 8px;
    @apply pl-8;

    &:focus,
    &:active {
      outline: 0;
      box-shadow: none;
    }
    &::placeholder {
      @apply text-placeholder dark:text-dark-placeholder;
    }
  }

  .input-icon {
    @apply absolute top-1/2 -translate-y-1/2 left-[10px] h-4 w-4;
    text-align: center;
  }
}
</style>
