import type { ILoginInfo, ILoginResp } from '@/types/api'
import { Resp } from '@/types/api'
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
export async function ApiUserInfo() {
  const res = await axios<any>({
    url: '/api/user/profile',
    method: 'get',
  })
  return res.data
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
