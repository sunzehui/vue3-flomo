<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ErrorMessage, Field as VField, Form as VForm } from 'vee-validate'
import { useVModel } from '@vueuse/core'
import { EyeClose, EyeOpen } from '@/components/icon'

const props = defineProps<{
  rule: string | ((value: string) => boolean | string)
  modelValue: string
}>()
const emit = defineEmits(['update:modelValue'])

const eyeShow = ref(false)
const password = useVModel(props, 'modelValue', emit)

// const password = computed({
//   get: () => props.modelValue,
//   set: (value) => {
//     emit('update:modelValue', value)
//   },
// })
</script>

<template>
  <div class="relative">
    <label for="password" class="sr-only">密码</label>
    <VField
      id="password"
      v-model="password"
      name="password"
      :type="eyeShow ? 'text' : 'password'"
      autocomplete="current-password"
      :rules="props.rule"
      class="flomo-input on-active"
      placeholder="密码"
    />
    <div class="eye_icon" @click="eyeShow = !eyeShow">
      <EyeOpen v-show="eyeShow" />
      <EyeClose v-show="!eyeShow" />
    </div>
  </div>

  <ErrorMessage
    name="password"
    class="text-red-500 text-xs italic"
  />
</template>

<style lang="scss" scoped>
 .eye_icon {
  @apply absolute top-1/2 right-2 h-full w-8 -translate-y-1/2;
  svg {
    @apply w-4 h-4 absolute top-1/2 right-2 -translate-y-1/2;
  }
}
.flomo-input {
  @apply appearance-none relative block w-full px-3 py-2 border border-gray-200 placeholder-gray-300 text-gray-900 rounded-md sm:text-sm h-10;
  &:on-active {
    @apply focus:outline-white focus:ring-indigo-500 focus:border-indigo-500 focus:z-10;
  }
}
</style>
