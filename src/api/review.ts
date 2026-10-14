import type { Memo } from '@/types/memo'
import request from '@/utils/request'

/** 抽取今日回顾的 memo */
export function ApiDailyReview(count = 6) {
  return request<Memo[]>({
    url: '/api/review/daily',
    method: 'get',
    params: { count },
  })
}

/** 标记本轮回顾已完成 */
export function ApiMarkReview(articleIds: Array<number | string>) {
  return request<{ affected: number }>({
    url: '/api/review/log',
    method: 'post',
    data: { articleIds },
  })
}

/** 回顾历史 */
export function ApiReviewHistory(limit = 30) {
  return request<Array<{ id: number, articleId: number, reviewDate: string }>>({
    url: '/api/review/history',
    method: 'get',
    params: { limit },
  })
}
