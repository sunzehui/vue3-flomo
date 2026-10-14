import type { Memo } from '@/types/memo'
import { escapeHtml } from '@/utils/editor'
import request from '@/utils/request'

export type TagFilterMode = 'and' | 'or'
export type ArticleSort = 'time_desc' | 'time_asc' | 'relevance'

export interface GetListParams {
  tag: string
  deleted: boolean
  content: string
  keywords: string
  tags: string
  tagMode: TagFilterMode
  from: string
  to: string
  hasImage: boolean
  sort: ArticleSort
  page: number
  pageSize: number
}

export interface MemoPage {
  list: Memo[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export function ApiList(query: Partial<GetListParams>) {
  return request<MemoPage>({
    url: '/api/article',
    method: 'get',
    params: query,
  })
}
export async function ApiUpdate(id: number, data: Partial<Memo> | { recycle: boolean }) {
  return await request<Memo>({
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
  data.content = `<p>${escapeHtml(data.content)}</p>`
  return await request<Memo>({
    url: '/api/article',
    method: 'post',
    data,
  })
}

/** 从回收站恢复 */
export function ApiRestore(id: number) {
  return request<Memo>({
    url: `/api/article/${id}/restore`,
    method: 'post',
  })
}

/** 批量给多条 memo 加/去标签 */
export function ApiBatchTag(payload: {
  ids: Array<number | string>
  add?: string[]
  remove?: string[]
}) {
  return request<{ affected: number }>({
    url: '/api/article/batch/tag',
    method: 'post',
    data: payload,
  })
}
