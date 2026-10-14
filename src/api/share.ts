import type { Memo } from '@/types/memo'
import type { User } from '@/types/user'
import request from '@/utils/request'

interface UserShareQuery {
  user_id: number | string
  page?: number
  pageSize?: number
  tag?: string
  content?: string
}
interface UserShareResp {
  usersMemo: Memo[]
  userInfo: User
  pagination: {
    total: number
    page: number
    pageSize: number
    hasMore: boolean
  }
}
export function ApiUser(query: UserShareQuery) {
  return request<UserShareResp>({
    url: '/api/share/user',
    method: 'get',
    params: query,
  })
}

export interface ShareSelectionResp {
  title: string
  createdAt: string
  userInfo: User
  usersMemo: Memo[]
}

/** 创建精选分享 */
export function ApiCreateSelection(payload: { title?: string, articleIds: Array<number | string> }) {
  return request<{ token: string, title: string, count: number }>({
    url: '/api/share/selection',
    method: 'post',
    data: payload,
  })
}

/** 读取精选分享 */
export function ApiGetSelection(token: string) {
  return request<ShareSelectionResp>({
    url: `/api/share/selection/${token}`,
    method: 'get',
  })
}

/** 撤销精选分享 */
export function ApiRevokeSelection(token: string) {
  return request<{ token: string, revoked: boolean }>({
    url: `/api/share/selection/${token}`,
    method: 'delete',
  })
}

/** RSS 订阅地址 */
export function ApiFeedUrl(userId: number) {
  return `/api/share/feed/${userId}.xml`
}
