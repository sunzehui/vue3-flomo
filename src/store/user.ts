import { defineStore } from 'pinia'
import type { MaybeRef } from '@vueuse/core'
import { useLocalStorage } from '@vueuse/core'

import jwtDecode from 'jwt-decode'
import { computed, unref } from 'vue'
import type { ILoginResp } from '@/types/api'
import {ApiUpdateUserInfo, ApiUserInfo, ApiUserLogin, ApiUserStatistic} from '@/api/user'
import {ElMessage} from "element-plus";
interface IMemoCount {
  memoCount: number
  tagCount: number
  day: number
}

export interface UserInfo {
  id: number
  username: string
  nickname: string
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

  const logout = async () => {
    userInfo.value = null
    setToken(null)
    return true
  }
  const updateNickName=async (nickname)=>{
    const res = await ApiUpdateUserInfo({ nickname: nickname.value })
    console.log(res)
    if(res.data===true){
      await   refreshUserInfo()
      ElMessage.success("保存成功！")
    }
  }

  const username = computed(() => {
    return unref(userInfo)?.username || '浮墨用户'
  })

  const nickname = computed(() => {
    return unref(userInfo)?.nickname || '浮墨用户'
  })
  const memo_count = computed(() => {
    return unref(userInfo)?.memo_count || 0
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
    // getStatisticInfo,
    isAuthenticated,
    username,
    memo_count,
    dailyGrid,
    login,
    logout,
    userRecord,

  }
})
