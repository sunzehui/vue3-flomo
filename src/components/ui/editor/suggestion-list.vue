<script lang="ts" setup>
import { ref } from 'vue'
import { templateRef, unrefElement } from '@vueuse/core'
import type { tagType } from '@/types/memo'
import { px2number } from '@/utils/Tool'

const props = defineProps<{ list: tagType[]; show: boolean }>()
const emit = defineEmits(['itemClick'])
const style = ref({
  top: 0,
  left: 0,
  transform: '',
})

const listRef = ref(null)

function handleItemClick(tag: tagType) {
  emit('itemClick', tag)
  return false
}
const selectItemIdx = ref(0)
defineExpose({
  syncPostion: (pos) => {
    style.value = {
      ...pos,
    }
  },
  getWidth(): number {
    const el = unrefElement(listRef)
    const css = window.getComputedStyle(el)
    return px2number(css.width)
  },
  setSelectItemIdx(idx: number) {
    selectItemIdx.value = idx
  },
  getSelectItemIdx() {
    return selectItemIdx.value
  },
})
</script>

<template>
  <div
    v-show="list.length"
    ref="listRef"
    :style="style"
    class="suggestion"
    :class="{ hidden: !show }"
  >
    <span
      v-for="(item, idx) of props.list" :key="item.id"
      :class="{ active: selectItemIdx === idx }"
      @mouseover="selectItemIdx = idx"
      @mousedown="handleItemClick(idx)"
    >
      {{ item.content }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.suggestion {
  position: absolute;
  background-color: black;
  max-width: 350px;
  padding: 5px;
  z-index: 99;
  border-radius: 5px;
  display: flex;
  flex-direction: column;

  &.hidden {
    visibility: hidden;
  }

  span {
    color: white;
    padding: 3px 20px;
    margin-bottom: 4px;
    white-space: nowrap;
    border-radius: 6px;
    cursor: pointer;
    user-select: none;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }

  &.show {
    display: block;
  }

}

.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
