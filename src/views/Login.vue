<script lang="ts" setup>
import { reactive } from 'vue'
import { Form as VForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import PasswordField from '@/components/ui/form/password.vue'
import UserNameField from '@/components/ui/form/username.vue'

const formData = reactive({
  username: '',
  password: '',
})

const usernameRule = (username: string) => {
  const isEmpty = username.length === 0
  if (isEmpty)
    return '用户名不能为空！'

  const isEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(username)
  if (isEmail)
    return true

  const isValidName = /^[a-zA-Z0-9]{6,18}$/.test(username)
  if (isValidName)
    return true

  return '用户名不符合规范，请检查！'
}

const passwordRule = (password: string) => {
  const isEmpty = password.length <= 0
  const isInvalid = !/(?=^.{6,}$).*$/.test(password)
  if (isEmpty)
    return '密码不可为空！'

  if (isInvalid)
    return '密码不符合规范！'

  return true
}
const router = useRouter()
const { login } = useUserStore()

const onSubmit = async () => {
  const isLogin = await login(formData.username, formData.password)
  if (isLogin)
    router.push({ path: '/' })
}
</script>

<template>
  <div class="flex items-center justify-center min-h-full px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-xs space-y-6 -translate-y-1/3">
      <div>
        <h3 class="text-3xl text-center font-bold">
          flomo
        </h3>
      </div>
      <VForm class="mt-8" @submit="onSubmit">
        <div class="space-y-3 rounded-md shadow-sm">
          <UserNameField v-model="formData.username" :rule="usernameRule" />
          <PasswordField v-model="formData.password" :rule="passwordRule" />
        </div>
        <button
          type="submit"
          class="submit-btn"
        >
          登录
        </button>
        <div class="w-full flex justify-center gap-x-5">
          <router-link to="/register" class="text-blue-400 select-none">
            注册
          </router-link>
          <router-link to="/reset" class="text-blue-400 select-none">
            忘记密码
          </router-link>
        </div>
      </VForm>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .submit-btn {
    @apply select-none relative w-full flex justify-center px-4 border border-transparent text-sm py-2.5 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
    @apply my-4;
  }
</style>
