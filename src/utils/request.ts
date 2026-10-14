import type { AxiosRequestConfig } from 'axios'
import Axios from 'axios'
import { ElMessage } from 'element-plus'
import { router } from '../routes'
import { hideLoading, showLoading } from './loading'
import type { Resp } from '@/types/api'
import { useUserStore } from '@/store/user'

// 留空表示同源：开发环境由 vite 代理 /api，生产环境由 nginx 转发
const baseURL = (import.meta.env.VITE_API_URL as string) || ''

const axiosInstance = Axios.create({
  baseURL,
  timeout: 20000, // 请求超时 20s
})
// 前置拦截器（发起请求之前的拦截）
axiosInstance.interceptors.request.use(
  (config) => {
    showLoading({
      fullscreen: false,
      background: 'transparent',
    })

    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json'
    config.headers.Accept = config.headers.Accept || 'application/json'
    const userStore = useUserStore()

    if (userStore?.token?.token)
      config.headers.Authorization = `Bearer ${userStore.token.token}`

    return config
  },
  (error) => {
    hideLoading()
    return Promise.reject(error)
  },
)
axiosInstance.interceptors.response.use(
  (resp) => {
    hideLoading()
    return resp
  },
  (error) => {
    hideLoading()
    const code = error?.response?.status
    const msg = error?.response?.data?.message || error?.message || '请求失败'
    console.error('[Axios Error]', error)

    if (code === 401) {
      // 登录态失效：清掉本地 token 并跳登录页（避免在登录页重复跳转）
      useUserStore().setToken(null)
      ElMessage.error('登录已过期，请重新登录')
      if (router.currentRoute.value.name !== 'Login')
        router.push({ name: 'Login' })
      return Promise.reject(error)
    }

    if (code === 500)
      ElMessage.error('服务器开小差了，请稍后重试')
    else
      ElMessage.error(`Code: ${code ?? '-'}, Message: ${msg}`)

    return Promise.reject(error)
  },
)
export default async function <T = any>(config: AxiosRequestConfig): Resp<T> {
  const res = await axiosInstance.request<Resp<T>>(config)
  return res.data
}
