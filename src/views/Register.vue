<script lang="ts" setup>
import { ref } from 'vue'
import {
  ErrorMessage,
  Field as VField,
  Form as VForm,
  defineRule,
} from 'vee-validate'
import { ElMessage } from 'element-plus'
import { ApiUserRegister } from '@/api/user'
import { router } from '@/routes'

const username = ref('')
const password = ref('')

defineRule('required', (value: string) => {
  const isEmpty = value?.length
  if (!isEmpty)
    return '字段不能为空'

  return true
})
defineRule('username', (value) => {
  // 用户名可能是邮箱也可能是手机号
  const isEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)
  if (isEmail)
    return true

  const isValidName = /^[a-zA-Z0-9]{6,18}$/.test(value)
  if (isValidName)
    return true

  return '用户名不符合规范，请检查！'
})

defineRule('password', (value) => {
  const isValid = /(?=^.{6,18}$).*$/.test(value)
  if (!isValid)
    return '密码长度为6-18位！'

  return true
})

defineRule('confirmed', (value, [other]) => {
  if (value !== other)
    return '两次输入的密码不一致！'

  return true
})

const onSubmit = async () => {
  const user = {
    username: username.value,
    password: password.value,
  }

  if (user) {
    ApiUserRegister({
      username: username.value,
      password: password.value,
    }).then((res) => {
      if (res.code === 0) {
        ElMessage.success('注册成功！')
        router.push('/login')
      }
    })
  }
}
</script>

<template>
  <div class="min-h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-xs w-full space-y-6 -translate-y-1/3">
      <div>
        <h3 class="text-3xl text-center font-bold">
          flomo - register
        </h3>
      </div>
      <VForm class="mt-8 space-y-2" @submit="onSubmit">
        <div class="rounded-md shadow-sm space-y-3">
          <div>
            <label for="email-address" class="sr-only">手机号码/邮箱</label>
            <VField
              id="email-address"
              v-model="username"
              name="email"
              type="email"
              autocomplete="email"
              rules="required|username"
              class="flomo-input on-active"
              placeholder="手机号码/邮箱"
            />
            <ErrorMessage
              name="email"
              class="text-red-500 text-xs italic"
            />
          </div>
          <div class="relative">
            <label for="password" class="sr-only">密码</label>
            <VField
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              rules="required|password"
              class="flomo-input on-active"
              placeholder="密码"
            />

            <ErrorMessage
              name="password"
              class="text-red-500 text-xs italic"
            />
          </div>
          <div class="relative">
            <label for="password2" class="sr-only">重复密码</label>
            <VField
              id="password2"
              name="password2"
              type="password"
              autocomplete="current-password"
              rules="required|confirmed:@password"
              class="flomo-input on-active"
              placeholder="请再次输入密码"
            />

            <ErrorMessage
              name="password2"
              class="text-red-500 text-xs italic"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="submit-btn"
          >
            注册
          </button>
        </div>
        <div class="w-full flex justify-center gap-x-5">
          <router-link to="/login" class="text-blue-400">
            登录
          </router-link>
          <router-link to="/reset" class="text-blue-400">
            忘记密码
          </router-link>
        </div>
      </VForm>
    </div>
  </div>
</template>

<style scoped lang="scss">
.flomo-input {
  @apply appearance-none relative block w-full px-3 py-2 border border-gray-200 placeholder-gray-300 text-gray-900 rounded-md sm:text-sm h-10;
  &:on-active {
    @apply focus:outline-white focus:ring-indigo-500 focus:border-indigo-500 focus:z-10;
  }
}
 .submit-btn {
    @apply select-none relative w-full flex justify-center px-4 border border-transparent text-sm py-2.5 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
    @apply my-4;
  }
</style>
