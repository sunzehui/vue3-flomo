import type { ILoginInfo, ILoginResp } from '@/types/api'
import { Resp } from '@/types/api'
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
  return axios<any>({
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
