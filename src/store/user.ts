import { defineStore } from 'pinia'
import type { MaybeRef } from '@vueuse/core'
import { useLocalStorage } from '@vueuse/core'

import jwtDecode from 'jwt-decode'
import { computed, unref } from 'vue'
import { ElMessage } from 'element-plus'
import type { ILoginResp } from '@/types/api'
import { ApiUpdateUserInfo, ApiUserInfo, ApiUserLogin, ApiUserStatistic } from '@/api/user'
import type { UserInfo } from '@/types/user'

export interface DailyGrid {
  [key: string]: number
}
export interface UserRecord {
  tagCount: number
  memoCount: number
  day: number
  dailyGrid: DailyGrid
}

export const useUserStore = defineStore('user', () => {
  const token = useLocalStorage('token', {
    token: '',
    expires: 0,
  })
  const userInfo = useLocalStorage('userInfo', {} as UserInfo)
  const userRecord = useLocalStorage('userRecord', {} as UserRecord)
  const setToken = (loginResp: ILoginResp) => {
    if (!loginResp)
      return token.value = null
    token.value = {
      token: loginResp?.token,
      expires: 36000,
    }
    try {
      const expires = jwtDecode<{ exp: number }>(loginResp.token).exp * 1000
      token.value.expires = expires
    }
    catch (e) {
      console.log(e)
      return token
    }
  }

  async function refreshUserInfo() {
    const res = await ApiUserInfo()
    userInfo.value = res.data.userInfo
    userRecord.value = res.data.userRecord
  }

  const login = async (username: MaybeRef<string>, password: MaybeRef<string>) => {
    try {
      const loginRes = await ApiUserLogin({
        username: unref(username),
        password: unref(password),
      })

      if (loginRes) {
        userInfo.value = null
        setToken(loginRes)
        refreshUserInfo()
        return true
      }
    }
    catch (e) {
      return false
    }
  }

  const logout = async () => {
    userInfo.value = null
    setToken(null)
    return true
  }
  const updateNickName = async (nickname) => {
    const res = await ApiUpdateUserInfo({ nickname: nickname.value })
    console.log(res)
    if (res.data === true) {
      await refreshUserInfo()
      ElMessage.success('保存成功！')
    }
  }

  const username = computed(() => {
    return unref(userInfo)?.username || '浮墨用户'
  })

  const nickname = computed(() => {
    return unref(userInfo)?.nickname || '浮墨用户'
  })
  const memoCount = computed(() => {
    return unref(userRecord)?.memoCount || 0
  })
  const tagCount = computed(() => {
    return unref(userRecord)?.tagCount || 0
  })
  const daysCount = computed(() => {
    return unref(userRecord)?.day || 0
  })
  const dailyGrid = computed(() => {
    return unref(userRecord)?.dailyGrid
  })
  const isAuthenticated = computed(() => {
    return unref(token)?.token !== '' && unref(token)?.expires > Date.now()
  })
  return {
    token,
    nickname,
    updateNickName,
    userInfo,
    setToken,
    isAuthenticated,
    username,
    dailyGrid,
    login,
    logout,
    userRecord,

    memoCount,
    tagCount,
    daysCount,
  }
})
