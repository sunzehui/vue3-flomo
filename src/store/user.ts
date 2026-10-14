import { defineStore } from 'pinia'
import type { MaybeRef } from '@vueuse/core'
import { useLocalStorage } from '@vueuse/core'

import jwtDecode from 'jwt-decode'
import { computed, unref } from 'vue'
import { ElMessage } from 'element-plus'
import type { ILoginResp } from '@/types/api'
import { ApiUpdateUserInfo, ApiUserInfo, ApiUserLogin } from '@/api/user'
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

const EMPTY_TOKEN = { token: '', expires: 0 }

export const useUserStore = defineStore('user', () => {
  const token = useLocalStorage('token', { ...EMPTY_TOKEN })
  const userInfo = useLocalStorage('userInfo', {} as UserInfo)
  const userRecord = useLocalStorage('userRecord', {} as UserRecord)
  const setToken = (loginResp: ILoginResp | null | undefined) => {
    if (!loginResp?.token) {
      // 统一重置为空对象，避免把 null 写进 localStorage 导致类型与取值分支混乱
      token.value = { ...EMPTY_TOKEN }
      return
    }
    token.value = {
      token: loginResp.token,
      expires: 36000,
    }
    try {
      const expires = jwtDecode<{ exp: number }>(loginResp.token).exp * 1000
      token.value.expires = expires
    }
    catch {
      // token 解析失败时沿用默认有效期
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

      if (!loginRes?.token)
        return false

      userInfo.value = {} as UserInfo
      setToken(loginRes)
      await refreshUserInfo()
      return true
    }
    catch (e) {
      return false
    }
  }

  const logout = async () => {
    userInfo.value = {} as UserInfo
    setToken(null)
    return true
  }
  const updateNickName = async (nickname) => {
    const res = await ApiUpdateUserInfo({ nickname: nickname.value })
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
    refreshUserInfo,
    userRecord,

    memoCount,
    tagCount,
    daysCount,
  }
})
