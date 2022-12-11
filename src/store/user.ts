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

export interface UserInfo {
  id: number
  username: string
  password: string
  memo_count: number
  day_count: number
  tag_count: number
  month_sign_id: number
  last_login: string
}
export interface DailyGrid {
  [key: string]: number
}
export interface UserRecord {
  tagCount: number
  memoCount: number
  day: number
  dailyGrid: DailyGrid
}

export interface ApiUserProfile {
  userInfo: UserInfo
  userRecord: UserRecord
}
export const useUserStore = defineStore('user', () => {
  const token = useLocalStorage('token', {
    token: '',
    expires: 0,
  })
  const userInfo = useLocalStorage('userInfo', {} as UserInfo)
  const userRecord = useLocalStorage('userRecord', {} as UserRecord)
  const setToken = (loginResp: ILoginResp) => {
    token.value = {
      token: loginResp.token,
      expires: 36000,
    }
    try {
      const expires = jwtDecode<{ exp: number }>(loginResp.token).exp * 1000
      token.value.expires = expires
    }
    catch (e) {
      console.log(e)
    }
  }

  async function refreshUserInfo() {
    const res = await ApiUserInfo()
    userInfo.value = res.userInfo
    userRecord.value = res.userRecord
  }
  const login = async (username: MaybeRef<string>, password: MaybeRef<string>) => {
    const loginRes = await ApiUserLogin({
      username: unref(username),
      password: unref(password),
    })

    if (loginRes) {
      userInfo.value = null
      setToken(loginRes)
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
  const dailyGrid = computed(() => {
    return unref(userRecord).dailyGrid
  })
  const isAuthenticated = computed(() => {
    return unref(token).token !== '' && unref(token).expires > Date.now()
  })
  return {
    token,
    userInfo,
    setToken,
    // getStatisticInfo,
    isAuthenticated,
    username,
    memo_count,
    dailyGrid,
    login,
    userRecord,

  }
})
