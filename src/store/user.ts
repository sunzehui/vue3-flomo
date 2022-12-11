import { defineStore } from 'pinia'
import type { MaybeRef } from '@vueuse/core'
import { useLocalStorage } from '@vueuse/core'

import jwtDecode from 'jwt-decode'
import { computed, unref } from 'vue'
import type { ILoginResp } from '@/types/api'
import { ApiUserInfo, ApiUserLogin, ApiUserStatistic } from '@/api/user'
interface IMemoCount {
  memoCount: number
  tagCount: number
  day: number
}

export const useUserStore = defineStore('user', () => {
  const token = useLocalStorage('token', {
    token: '',
    expires: 0,
  })
  const userInfo = useLocalStorage('userInfo', {
    last_login: '',
    memo_count: {
      memoCount: 0,
      tagCount: 0,
      day: 0,
    } as IMemoCount,
    daily_grid: {},
    username: '浮墨用户',
  })
  const setToken = (_token: ILoginResp['token']) => {
    const expires = jwtDecode<{ exp: number }>(_token.token).exp * 1000
    token.value = {
      token: _token.token,
      expires,
    }
  }
  async function getStatisticInfo() {
    const res = await ApiUserStatistic()
    const { memo_count, daily_grid } = res.data
    this.userInfo.memo_count = memo_count
    this.userInfo.daily_grid = daily_grid
  }

  async function refreshUserInfo() {
    const res = await ApiUserInfo()
    userInfo.value = res.data
    await getStatisticInfo()
  }
  const login = async (username: MaybeRef<string>, password: MaybeRef<string>) => {
    const user = await ApiUserLogin({
      username: unref(username),
      password: unref(password),
    })

    if (user) {
      userInfo.value = null
      setToken(user.data.token)
      await refreshUserInfo()
      return true
    }
    return false
  }

  const username = computed(() => {
    return unref(userInfo).username
  })
  const memo_count = computed(() => {
    return unref(userInfo).memo_count
  })
  const daily_grid = computed(() => {
    return unref(userInfo).daily_grid
  })
  const isAuthenticated = computed(() => {
    return unref(token).token !== '' && unref(token).expires > Date.now()
  })
  return {
    token,
    userInfo,
    setToken,
    getStatisticInfo,
    isAuthenticated,
    username,
    memo_count,
    daily_grid,
    login,
  }
})
