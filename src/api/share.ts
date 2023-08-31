import type { Memo } from '@/types/memo'
import type { User } from '@/types/user'
import request from '@/utils/request'

interface UserShareQuery {
  user_id: number | string
}
interface UserShareResp {
  usersMemo: Memo[]
  userInfo: User
}
export function ApiUser(query: UserShareQuery) {
  return request<UserShareResp>({
    url: '/api/share/user',
    method: 'get',
    params: query,
  })
}
