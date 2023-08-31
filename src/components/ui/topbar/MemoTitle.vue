<script lang="ts" setup>
import { toRefs } from 'vue'
import { useLayoutStore } from '@/store/layout'
const { setLeftMenuOpen } = useLayoutStore()

const { isPC } = toRefs(useLayoutStore())
</script>

<template>
  <div class="title-wrp">
    <span v-show="!isPC" class="showLeftPanelBtn" @click.stop="setLeftMenuOpen(true)">三</span>
    <span class="title hover-bg">
      <slot name="title">
        MEMO
      </slot>
    </span>
    <slot name="sub-title" />
    <slot name="tool" />
  </div>
</template>

<style lang="scss" scoped>
.icon {
  font-style: normal;
  height: 18px;
  width: 18px;
  display: inline-block;
  opacity: 0.8;
  cursor: pointer;
  @apply p-2 box-content;
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
.title-wrp{
  flex-shrink: 0;
  @apply flex items-center;
}
.hover-bg {
  @apply rounded-md duration-300 transition-colors;
  &:hover {
    background: rgba(55, 53, 47, 0.08);
  }
}
.title-wrp{
 > span.title {

  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: #5f5f5f;
  cursor: pointer;
  flex-shrink: 0;
  @apply relative;
  @apply px-2;

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
.showLeftPanelBtn{
  @apply text-gray-500 text-base mr-2;
  cursor: pointer;
}
</style>
