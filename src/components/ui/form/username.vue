<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import { ErrorMessage, Field as VField, Form as VForm } from 'vee-validate'
const props = defineProps<{
  rule: string | ((value: string) => boolean | string)
  modelValue: string
}>()
const emit = defineEmits(['update:modelValue'])

const username = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})
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
  @apply appearance-none relative block w-full px-3 py-2 border border-gray-200 placeholder-gray-300 text-gray-900 rounded-md sm:text-sm h-10;
  &:on-active {
    @apply focus:outline-white focus:ring-indigo-500 focus:border-indigo-500 focus:z-10;
  }
}
</style>
