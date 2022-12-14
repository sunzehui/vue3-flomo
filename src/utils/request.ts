import type { AxiosRequestConfig } from 'axios'
import Axios from 'axios'
import { ElMessage } from 'element-plus'
import { router } from '../routes'
import { hideLoading, showLoading } from './loading'
import type { Resp } from '@/types/api'
import { useUserStore } from '@/store/user'
const baseURL = import.meta.env.VITE_BASE_URL as string | undefined

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
    const UserStore = useUserStore()
    config.headers['Content-Type'] = 'application/json'
    config.headers.Accept = 'application/json'
    console.log('UserStore.token', UserStore?.token?.token)

    config.headers.Authorization = `Bearer ${UserStore?.token?.token}`
    return config
  },
  (error) => {
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
    const msg = error?.response?.data?.message
    console.error('[Axios Error]', error)
    if (code === 500) {
      ElMessage.error(`Code: ${code}, Message: 请检查网络`)
      return
    }
    if (code === 401) {
      ElMessage.error(`Code: ${code}, Message: ${msg}`)

      router.push({
        path: '/login',
      })
      return
    }
    ElMessage.error(`Code: ${code}, Message: ${msg}`)

    return null
  },
)
export default async function<T = any>(config: AxiosRequestConfig): Resp<T> {
  const { data } = await axiosInstance.request<Resp<T>>(config)
  return data
}
