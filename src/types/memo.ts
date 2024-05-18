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
export interface FileRecord {
  id: number
  url: string
  filePath: string
}
export interface Memo {
  id: number
  content: string
  deleteTime?: any
  createTime: string
  updateTime: string
  is_topic: boolean
  user: User
  tags: any[]
  images?: FileRecord[]
}
