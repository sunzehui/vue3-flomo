<script setup lang="ts">
import { ref, unref, watchEffect } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { router } from '@/routes'
import { useMemoStore } from '@/store/memo'
import { useLayoutStore } from '@/store/layout'
const props = defineProps<{
  link: string
  isTopic: boolean
}>()
const isClickMe = ref(false)
const route = useRoute()

watchEffect(() => {
  const { tag } = route.query
  isClickMe.value = tag?.toString() === props.link?.toString()
})
const { isPC,toggleDrawerOpen } = useLayoutStore()
const handleClick = () => {
  console.log('click');

  const ispc = unref(isPC)
  if (!ispc)
    toggleDrawerOpen(false)
  
  router.push({
    name: 'memo',
    query: {
      tag: props.link,
    },
  })
}

const articleStore = useMemoStore()
const setTop = () => {
  const title = props.isTopic ? '取消置顶' : '置顶'
  ElMessageBox.confirm(`确定${title}该标签吗?`, 'Info', {
    lockScroll: false,
  })
    .then(
      () =>
        articleStore
          .setTagTop({ tag: props.link, topic: !props.isTopic }),
    )
    .catch(() => {})
}
</script>

<template>
  <div class="tag-wrap" :class="{ active: isClickMe }" @click.prevent="handleClick">
    <span class="tag">
      <svg
        class="sharp-icon"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect opacity="0.01" width="18" height="18" fill="currentColor" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6.153 7.5L5.838 10.5H3V12H5.6805L5.28675 15.75H6.795L7.18875 12H10.1805L9.78675 15.75H11.295L11.6888 12H15V10.5H11.847L12.162 7.5H15V6H12.3195L12.7133 2.25H11.205L10.8113 6H7.8195L8.21325 2.25H6.705L6.31125 6H3V7.5H6.153ZM10.3387 10.5H7.34625L7.66125 7.5H10.6537L10.3387 10.5Z"
          fill="currentColor"
        />
      </svg>
      <label class="cursor-pointer">
        <slot />
      </label>
    </span>
    <Download
      class="right-arrow-icon"
      :class="{ rotate: !props.isTopic }"
      style="height: 1em; width: 1em"
      :color="isClickMe ? 'white' : 'gray'"
      @click.prevent="setTop()"
    />
  </div>
</template>

<style lang="scss" scoped>
.tag-wrap{
  @apply relative flex justify-between items-center w-full cursor-pointer;
  border-radius: 5px;
  &:hover {
    @apply bg-dark-fill-2 text-regular-text;
  }
  &.active {
    @apply bg-primary text-light-text;
  }
}
span.tag {
  line-height: 40px;
  display: flex;
  align-items: center;
  user-select: none;
  border-radius: 0.375rem;
  padding-left: 0.5rem;
  .sharp-icon {
    display: inline-block;
    margin-right: 6px;
    padding-bottom: 0px;
  }
  svg {
    display: inline-block;
  }
  position: relative;

}
.right-arrow-icon {
  margin-right: 10px;
  cursor: pointer;
  &.rotate {
    transform: rotate(180deg);
  }
}
</style>
