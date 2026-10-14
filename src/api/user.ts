import type { ILoginInfo, ILoginResp } from '@/types/api'
import type { IUserProfile } from '@/types/user'
import axios from '@/utils/request'

export async function ApiUserLogin(data: ILoginInfo) {
  const res = await axios<ILoginResp>({
    url: '/api/auth/login',
    method: 'post',
    data,
  })
  return res.data
}
export function ApiUserStatistic() {
  return axios<Record<string, number>>({
    url: '/api/statistic/grid',
    method: 'get',
  })
}

export function ApiUserInfo() {
  return axios<IUserProfile>({
    url: '/api/user/profile',
    method: 'get',
  })
}
export async function ApiUpdateUserInfo({ nickname }) {
  return await axios<any>({
    url: '/api/user/profile',
    method: 'put',
    data: {
      nickname,
    },
  })
}
export function ApiUserRegister(data) {
  return axios<{
    status: true
    message: 'ok'
  }>({
    url: '/api/user/register',
    method: 'post',
    data,
  })
}

/** 修改密码 */
export function ApiChangePassword(payload: { oldPassword: string, newPassword: string }) {
  return axios<boolean>({
    url: '/api/user/password',
    method: 'put',
    data: payload,
  })
}

export interface UserOverview {
  tagCount: number
  memoCount: number
  day: number
  streak: number
  activeDays: number
  weeklyTrend: Array<{ week: string, label: string, count: number }>
  tagDistribution: Array<{ content: string, count: number }>
}

/** 洞察面板数据 */
export function ApiUserOverview() {
  return axios<UserOverview>({
    url: '/api/statistic/overview',
    method: 'get',
  })
}
