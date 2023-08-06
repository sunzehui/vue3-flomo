import type { User } from './user'
export interface NewAticle {
  id?: number
  tags: string[]
  content: string
}
export interface tagType {
  name: string
  id: string
  active?: boolean
  is_topics?: boolean
  content: string
}

export interface Article {
  id: number
  content: string
  deleteTime?: any
  createTime: string
  updateTime: string
  is_topic: boolean
  user: User
  tags: any[]
}
