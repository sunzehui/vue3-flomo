<script lang="ts" setup>
import { ref } from "vue";
import { Form as VForm, Field as VField, ErrorMessage } from "vee-validate";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";
import { ApiUserLogin } from "@/api/user";

const username = ref("sunzehui");
const password = ref("sunzehui");

const eyeShow = ref(false);
const usernameRule = (username) => {
  const isEmpty = username.length === 0;
  if (isEmpty) {
    return "用户名不能为空！";
  }
  const isEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(username);
  if (isEmail) {
    return true;
  }
  const isValidName = /^[a-zA-Z0-9]{6,18}$/.test(username);
  if (isValidName) {
    return true;
  }
  return "用户名不符合规范，请检查！";
};

const passwordRule = (password) => {
  const notEmpty = password.length > 0;
  const isValid = /(?=^.{6,}$).*$/.test(password);
  return notEmpty && isValid;
};
const router = useRouter();
const userStore = useUserStore();

const onSubmit = async () => {
  const user = await ApiUserLogin({
    username: username.value,
    password: password.value,
  });

  if (user) {
    userStore.setToken(user.data.token);
    router.push({
      path: "/memo",
    });
  }
};
</script>

<template>
  <div class="min-h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-xs w-full space-y-6 -translate-y-1/3">
      <div>
        <h3 class="text-3xl text-center font-bold">flomo</h3>
      </div>
      <VForm class="mt-8 space-y-2" @submit="onSubmit">
        <div class="rounded-md shadow-sm space-y-3">
          <div>
            <label for="email-address" class="sr-only">手机号码/邮箱</label>
            <VField
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              :rules="usernameRule"
              v-model="username"
              class="flomo-input on-active"
              placeholder="手机号码/邮箱"
            />
            <ErrorMessage
              name="email"
              class="text-red-500 text-xs italic"
            ></ErrorMessage>
          </div>
          <div class="relative">
            <label for="password" class="sr-only">密码</label>
            <VField
              id="password"
              name="password"
              :type="eyeShow ? 'text' : 'password'"
              autocomplete="current-password"
              :rules="passwordRule"
              v-model="password"
              class="flomo-input on-active"
              placeholder="密码"
            />

            <ErrorMessage
              name="password"
              class="text-red-500 text-xs italic"
            ></ErrorMessage>
            <div class="eye_open" @click="eyeShow = false" v-show="eyeShow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="gray"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>

            <div class="eye_close" @click="eyeShow = true" v-show="!eyeShow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="gray"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center px-4 border border-transparent text-sm py-2.5 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            登录
          </button>
        </div>
        <div class="w-full flex justify-center gap-x-5">
          <router-link to="/logup" class="text-blue-400"> 注册 </router-link>
          <router-link to="/reset" class="text-blue-400">
            忘记密码
          </router-link>
        </div>
      </VForm>
    </div>
  </div>
</template>

<style scoped lang="scss">
.eye_open,
.eye_close {
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
