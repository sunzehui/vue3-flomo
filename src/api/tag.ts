import type { tagType } from '@/types/memo'
import request from '@/utils/request'
export function ApiList() {
  return request<tagType[]>({
    url: '/api/tag',
    method: 'get',
  })
}

export function ApiUpdate(oldTagName, data: Partial<tagType>) {
  return request<any>({
    url: `/api/tag/${oldTagName}`,
    method: 'patch',
    data,
  })
}
