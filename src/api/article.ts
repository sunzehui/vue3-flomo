import type { Memo } from '@/types/memo'
import request from '@/utils/request'
import type { IResponse } from '@/types/api'

export function ApiList(data) {
  return request<Memo[]>({
    url: '/api/article',
    method: 'get',
    params: data,
  })
}
export function ApiUpdate(id: number, data: Partial<Memo> | { recycle: boolean }) {
  return request<any>({
    url: `/api/article/${id}`,
    method: 'patch',
    data,
  })
}
export function ApiDelete(id: number) {
  return request<any>({
    url: `/api/article/${id}`,
    method: 'delete',
  })
}

export async function ApiSave(data: Partial<Memo>) {
  return await request<Memo>({
    url: '/api/article',
    method: 'post',
    data,
  })
}
