export interface UserInfo {
  id: number
  username: string
  nickname: string
  memo_count: number
  day_count: number
  tag_count: number
  month_sign_id: number
  last_login: string
}

export interface DailyGrid {
  [key: string]: number
}

export interface UserRecord {
  tagCount: number
  memoCount: number
  day: number
  dailyGrid: DailyGrid
}

export interface IUserProfile {
  userInfo: UserInfo
  userRecord: UserRecord
}
export interface User {
  id: number
  nickname: string
  username: string
  password: string
  memo_count: number
  day_count: number
  tag_count: number
  month_sign_id: number
  last_login: string
}
