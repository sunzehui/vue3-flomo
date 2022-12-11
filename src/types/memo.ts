export interface User {
  id: number
  username: string
  password: string
  memo_count: number
  day_count: number
  tag_count: number
  month_sign_id: number
  last_login: string
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
}
