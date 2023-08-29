<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import { createPopper } from '@popperjs/core'
import { onClickOutside } from '@vueuse/core'
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['picked', 'update:modelValue'])
const open = ref(false)

watchEffect(() => {
  emit('update:modelValue', open.value)
})
const pickerRef = ref(null)
const createPicker = () => {
  console.log('createPicker')

  const button = document.querySelector('.icon-emoji')
  createPopper(button, pickerRef.value, {
    placement: 'bottom-end',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
    ],
  })
}
watchEffect(() => {
  if (props.modelValue) {
    open.value = true
    createPicker()
  }
})
onClickOutside(pickerRef, (evt) => {
  const target = evt.target as HTMLElement
  if (target.classList?.contains('icon-emoji'))
    return
  open.value = false
})
const handleSelect = (emoji: string) => {
  emit('picked', emoji)
  open.value = false
}
</script>

<template>
  <Transition name="fade">
    <div
      v-show="open" ref="pickerRef"
      class="emoji-picker-wrap"
    >
      <EmojiPicker :native="true" @select="handleSelect" />
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.emoji-picker-wrap{
  @apply z-30 absolute;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
