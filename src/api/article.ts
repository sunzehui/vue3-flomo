import type { Article } from '@/types/article'
import axios from '@/utils/request'
import type { IResponse } from '@/types/api'

export function ApiList(data) {
  return axios<Article[]>({
    url: '/api/article',
    method: 'get',
    params: data,
  })
}
export function ApiUpdate(id: number, data: Partial<Article>) {
  return axios<any>({
    url: `/api/article/${id}`,
    method: 'patch',
    data,
  })
}
export function ApiDelete(id: number) {
  return axios<IResponse<any>>({
    url: `/api/article/${id}`,
    method: 'delete',
  })
}

export function ApiSave(data: Partial<Article>) {
  return axios<IResponse<any>>({
    url: '/api/article',
    method: 'post',
    data,
  })
}
