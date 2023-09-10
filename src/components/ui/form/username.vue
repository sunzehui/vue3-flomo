<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import { ErrorMessage, Field as VField, Form as VForm } from 'vee-validate'
import { useVModel } from '@vueuse/core'
const props = defineProps<{
  rule: string | ((value: string) => boolean | string)
  modelValue: string
}>()
const emit = defineEmits(['update:modelValue'])

// const username = computed({
//   get: () => props.modelValue,
//   set: (value: string) => emit('update:modelValue', value),
// })
const username = useVModel(props, 'modelValue', emit)
</script>

<template>
  <div>
    <label for="email-address" class="sr-only">手机号码/邮箱</label>
    <VField
      id="email-address"
      v-model="username"
      name="email"
      type="email"
      autocomplete="email"
      :rules="props.rule"
      class="flomo-input on-active"
      placeholder="手机号码/邮箱"
    />
    <ErrorMessage
      name="email"
      class="text-red-500 text-xs italic"
    />
  </div>
</template>

<style scoped lang="scss">
.flomo-input {
  @apply appearance-none relative block h-10 w-full px-3 py-2;
  @apply border border-placeholder placeholder-secondary-text text-secondary-text;
  @apply rounded-md sm:text-sm;
  &:on-active {
    @apply focus:outline-white focus:ring-primary-light-1 focus:border-primary-light-1 focus:z-10;
  }
}
</style>
