import type { Article } from '@/types/article'
import request from '@/utils/request'
import type { IResponse } from '@/types/api'

export function ApiList(data) {
  return request<Article[]>({
    url: '/api/article',
    method: 'get',
    params: data,
  })
}
export function ApiUpdate(id: number, data: Partial<Article>) {
  return request<any>({
    url: `/api/article/${id}`,
    method: 'patch',
    data,
  })
}
export function ApiDelete(id: number) {
  return request<IResponse<any>>({
    url: `/api/article/${id}`,
    method: 'delete',
  })
}

export function ApiSave(data: Partial<Article>) {
  return request<IResponse<any>>({
    url: '/api/article',
    method: 'post',
    data,
  })
}
