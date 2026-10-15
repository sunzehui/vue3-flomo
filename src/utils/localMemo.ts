/**
 * 本地模式数据层：未登录时所有数据存 localStorage，不发起任何网络请求。
 *
 * 返回结构与后端 TransformInterceptor 包装后的 { code, data, message } 保持一致，
 * 这样 store 层只需在入口处按登录态分流，下游组件完全无感。
 */
import dayjs from 'dayjs'
import type { GetListParams, MemoPage } from '@/api/memo'
import type { FileRecord, Memo, tagType } from '@/types/memo'
import type { UserRecord } from '@/store/user'
import { IMAGE_PREFIX, allImages, isLocalImage, restoreImages } from './localImages'

/** 上传组件在本地模式传回的是 idb:// 引用字符串，统一转成 FileRecord 形状 */
function normalizeImages(images: unknown): FileRecord[] {
  return ((Array.isArray(images) ? images : []) as Array<string | FileRecord>)
    .map((img, i) => typeof img === 'string'
      ? { id: -(Date.now() % 1_000_000_000 + i), url: img, filePath: img }
      : img)
}

const MEMO_KEY = 'local_memo_list'
const TAG_KEY = 'local_tag_list'
const SEQ_KEY = 'local_memo_seq'
const REVIEW_KEY = 'local_review_log'

const TIME_FMT = 'YYYY-MM-DD HH:mm:ss'

/** 本地模式的虚拟用户（仅保留后端实体中被前端用到的字段） */
export const LOCAL_USER = { id: 0, username: 'local-guest', nickname: '本地访客' }

interface LocalMemo extends Memo {
  deleteTime: string | null
}

interface LocalReviewLog {
  id: number
  articleId: number
  reviewDate: string
}

let cache: { memos: LocalMemo[]; tags: tagType[]; seq: number; reviewSeq: number } | null = null

function load() {
  if (cache)
    return cache
  const read = <T>(key: string, fallback: T): T => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) as T : fallback
    }
    catch {
      return fallback
    }
  }
  cache = {
    memos: read<LocalMemo[]>(MEMO_KEY, []),
    tags: read<tagType[]>(TAG_KEY, []),
    seq: read<number>(SEQ_KEY, 0),
    reviewSeq: read<number>(REVIEW_KEY, 0) as unknown as number,
  }
  // reviewSeq 与日志分两个 key 存，避免历史数据互相覆盖
  cache.reviewSeq = read<{ seq?: number }>(REVIEW_KEY, {}).seq ?? 0
  return cache
}

function persist() {
  const { memos, tags, seq } = load()
  localStorage.setItem(MEMO_KEY, JSON.stringify(memos))
  localStorage.setItem(TAG_KEY, JSON.stringify(tags))
  localStorage.setItem(SEQ_KEY, String(seq))
}

function nextId() {
  const state = load()
  state.seq += 1
  return state.seq
}

function ok<T>(data: T) {
  return { code: 0, data, message: 'ok' }
}

/** 从 #标签# / #标签+空格 提取标签名（与编辑器插入习惯一致） */
export function extractTags(content: string): string[] {
  const result = new Set<string>()
  const re = /#([^#\s]{1,50}?)#?/g
  let m: RegExpExecArray | null
  while ((m = re.exec(content))) result.add(m[1])
  return [...result]
}

/** 按内容查找或创建标签，返回与 memo 关联的 tagType[] */
function ensureTags(contents: string[]): tagType[] {
  const { tags } = load()
  return contents.map((content) => {
    let tag = tags.find(t => t.content === content)
    if (!tag) {
      tag = { id: nextId(), content, is_topics: false, parentId: null }
      tags.push(tag)
    }
    return tag
  })
}

function toPublic(memo: LocalMemo): Memo {
  const { deleteTime, ...rest } = memo
  return { ...rest } as Memo
}

export function listMemos(query: Partial<GetListParams>): MemoPage {
  const { memos } = load()
  const wantDeleted = query.deleted === true
  let list = memos.filter(m => (wantDeleted ? !!m.deleteTime : !m.deleteTime))

  if (!wantDeleted && query.tag)
    list = list.filter(m => m.tags.some(t => t.content === query.tag))

  if (query.tags) {
    const names = String(query.tags).split(',').map(s => s.trim()).filter(Boolean)
    if (names.length) {
      const mode = query.tagMode || 'or'
      list = list.filter((m) => {
        const hits = names.map(n => m.tags.some(t => t.content === n))
        return mode === 'and' ? hits.every(Boolean) : hits.some(Boolean)
      })
    }
  }

  const kw = String(query.keywords ?? query.content ?? '').trim().toLowerCase()
  if (kw)
    list = list.filter(m => m.content.toLowerCase().includes(kw))

  if (query.from)
    list = list.filter(m => dayjs(m.createTime).isAfter(dayjs(query.from).startOf('day').subtract(1, 'millisecond')))
  if (query.to)
    list = list.filter(m => dayjs(m.createTime).isBefore(dayjs(query.to).endOf('day').add(1, 'millisecond')))

  if (query.hasImage)
    list = list.filter(m => (m.images?.length ?? 0) > 0)

  const timeKey = (m: LocalMemo) => dayjs(m.createTime).valueOf()
  const sorted = [...list]
  if (query.sort === 'time_asc')
    sorted.sort((a, b) => timeKey(a) - timeKey(b))
  else if (query.sort === 'relevance' && kw)
    sorted.sort((a, b) => countHits(b.content, kw) - countHits(a.content, kw) || timeKey(b) - timeKey(a))
  else
    sorted.sort((a, b) => timeKey(b) - timeKey(a))

  const page = Math.max(1, Number(query.page ?? 1))
  const pageSize = Math.max(1, Number(query.pageSize ?? 20))
  const start = (page - 1) * pageSize
  return {
    list: sorted.slice(start, start + pageSize).map(toPublic),
    total: sorted.length,
    page,
    pageSize,
    hasMore: start + pageSize < sorted.length,
  }
}

function countHits(content: string, kw: string) {
  const lower = content.toLowerCase()
  let count = 0
  let idx = lower.indexOf(kw)
  while (idx >= 0) {
    count++
    idx = lower.indexOf(kw, idx + kw.length)
  }
  return count
}

export function saveMemo(data: Partial<Memo>) {
  const now = dayjs().format(TIME_FMT)
  const memo: LocalMemo = {
    id: nextId(),
    content: data.content ?? '',
    createTime: now,
    updateTime: now,
    deleteTime: null,
    is_topic: false,
    user: LOCAL_USER as Memo['user'],
    tags: ensureTags(extractTags(data.content ?? '')),
    images: normalizeImages(data.images),
  }
  load().memos.push(memo)
  persist()
  return ok(toPublic(memo))
}

export function updateMemo(id: number, data: Partial<Memo> & { recycle?: boolean }) {
  const { memos } = load()
  const memo = memos.find(m => m.id === Number(id))
  if (!memo)
    return { code: -1, data: null, message: 'memo 不存在' }

  if ('recycle' in data && data.recycle != null) {
    memo.deleteTime = data.recycle ? dayjs().format(TIME_FMT) : null
  }
  else {
    if (data.content != null) {
      memo.content = data.content
      memo.tags = ensureTags(extractTags(data.content))
    }
    if (data.is_topic != null)
      memo.is_topic = data.is_topic
    if (data.images != null)
      memo.images = normalizeImages(data.images)
    memo.updateTime = dayjs().format(TIME_FMT)
  }
  persist()
  return ok(toPublic(memo))
}

export function deleteMemo(id: number) {
  const { memos } = load()
  const memo = memos.find(m => m.id === Number(id))
  if (!memo)
    return { code: -1, data: null, message: 'memo 不存在' }
  memo.deleteTime = dayjs().format(TIME_FMT)
  persist()
  return ok(null)
}

export function restoreMemo(id: number) {
  const { memos } = load()
  const memo = memos.find(m => m.id === Number(id))
  if (!memo)
    return { code: -1, data: null, message: 'memo 不存在' }
  memo.deleteTime = null
  memo.updateTime = dayjs().format(TIME_FMT)
  persist()
  return ok(toPublic(memo))
}

export function batchTag(payload: { ids: Array<number | string>, add?: string[], remove?: string[] }) {
  const { memos, tags } = load()
  let affected = 0
  for (const rawId of payload.ids ?? []) {
    const memo = memos.find(m => m.id === Number(rawId))
    if (!memo)
      continue
    const idSet = new Set(memo.tags.map(t => t.id))
    for (const name of payload.add ?? []) {
      const tag = ensureTags([name])[0]
      if (!idSet.has(tag.id)) {
        memo.tags.push(tag)
        idSet.add(tag.id)
      }
    }
    for (const name of payload.remove ?? []) {
      const target = tags.find(t => t.content === name)
      if (target)
        memo.tags = memo.tags.filter(t => t.id !== target.id)
    }
    memo.updateTime = dayjs().format(TIME_FMT)
    affected++
  }
  persist()
  return ok({ affected })
}

export function tagList(): tagType[] {
  return load().tags.map(t => ({ ...t }))
}

export function updateTag(name: string, data: { content?: string, is_topics?: boolean, parentId?: number | null }) {
  const { tags } = load()
  const tag = tags.find(t => t.content === name)
  if (!tag)
    return { code: -1, data: null, message: '标签不存在' }

  if (data.content && data.content !== name) {
    if (tags.some(t => t.content === data.content))
      return { code: -1, data: null, message: '同名标签已存在' }
    // 重命名标签要同步所有关联 memo
    const { memos } = load()
    for (const memo of memos) {
      for (const t of memo.tags) {
        if (t.id === tag.id)
          t.content = data.content
      }
    }
    tag.content = data.content
  }
  if (data.is_topics != null)
    tag.is_topics = data.is_topics
  if ('parentId' in data)
    tag.parentId = data.parentId

  persist()
  return ok(tag)
}

/** 本地版用户统计：热力图、连续天数、计数 */
export function userRecord(): UserRecord {
  const { memos } = load()
  const active = memos.filter(m => !m.deleteTime)
  const dailyGrid: Record<string, number> = {}
  for (const memo of active) {
    const day = dayjs(memo.createTime).format('YYYY-MM-DD')
    dailyGrid[day] = (dailyGrid[day] ?? 0) + 1
  }
  // 连续天数：从今天（或昨天）往前数
  let day = 0
  let cursor = dayjs()
  if (!dailyGrid[cursor.format('YYYY-MM-DD')])
    cursor = cursor.subtract(1, 'day')
  while (dailyGrid[cursor.format('YYYY-MM-DD')]) {
    day++
    cursor = cursor.subtract(1, 'day')
  }
  return {
    tagCount: new Set(active.flatMap(m => m.tags.map(t => t.id))).size,
    memoCount: active.length,
    day,
    dailyGrid,
  }
}

/** 本地版每日回顾：随机抽取未回顾过的 memo */
export function dailyReview(count = 6) {
  const { memos } = load()
  const reviewed = new Set(reviewLogs().map(l => l.articleId))
  const pool = memos.filter(m => !m.deleteTime && !reviewed.has(m.id))
  const picked = [...pool].sort(() => Math.random() - 0.5).slice(0, count)
  return ok(picked.map(toPublic))
}

function reviewLogs(): LocalReviewLog[] {
  try {
    return JSON.parse(localStorage.getItem(`${REVIEW_KEY}_logs`) || '[]') as LocalReviewLog[]
  }
  catch {
    return []
  }
}

export function markReview(articleIds: Array<number | string>) {
  const logs = reviewLogs()
  const today = dayjs().format('YYYY-MM-DD')
  let seq = load().reviewSeq
  for (const rawId of articleIds ?? []) {
    seq++
    logs.push({ id: seq, articleId: Number(rawId), reviewDate: today })
  }
  load().reviewSeq = seq
  localStorage.setItem(`${REVIEW_KEY}_logs`, JSON.stringify(logs))
  localStorage.setItem(REVIEW_KEY, JSON.stringify({ seq }))
  return ok({ affected: articleIds?.length ?? 0 })
}

export function reviewHistory(limit = 30) {
  const logs = reviewLogs()
  return ok(logs.slice(-limit).reverse())
}

/** 本地版洞察面板数据（与 /api/statistic/overview 同构） */
export function localOverview() {
  const { memos, tags } = load()
  const active = memos.filter(m => !m.deleteTime)
  const dailyGrid: Record<string, number> = {}
  for (const memo of active) {
    const day = dayjs(memo.createTime).format('YYYY-MM-DD')
    dailyGrid[day] = (dailyGrid[day] ?? 0) + 1
  }

  let streak = 0
  let cursor = dayjs()
  if (!dailyGrid[cursor.format('YYYY-MM-DD')])
    cursor = cursor.subtract(1, 'day')
  while (dailyGrid[cursor.format('YYYY-MM-DD')]) {
    streak++
    cursor = cursor.subtract(1, 'day')
  }

  // 近 12 周（周一为起点）记录趋势
  const mondayOf = d => d.subtract((d.day() + 6) % 7, 'day').startOf('day')
  const thisWeek = mondayOf(dayjs())
  const weeklyTrend: Array<{ week: string, label: string, count: number }> = []
  for (let i = 11; i >= 0; i--) {
    const start = thisWeek.subtract(i, 'week')
    let count = 0
    const cur = start
    const end = start.add(7, 'day')
    while (cur.isBefore(end)) {
      count += dailyGrid[cur.format('YYYY-MM-DD')] ?? 0
      cur.add(1, 'day')
    }
    weeklyTrend.push({ week: start.format('YYYY-MM-DD'), label: start.format('M/D'), count })
  }

  const dist = new Map<string, number>()
  for (const memo of active) {
    for (const t of memo.tags) dist.set(t.content, (dist.get(t.content) ?? 0) + 1)
  }
  const tagDistribution = [...dist.entries()]
    .map(([content, count]) => ({ content, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    tagCount: tags.length,
    memoCount: active.length,
    day: streak,
    streak,
    activeDays: Object.keys(dailyGrid).length,
    weeklyTrend,
    tagDistribution,
  }
}

/** 清空本地数据（退出本地模式 / 主动重置时用） */
export function clearLocalData() {
  localStorage.removeItem(MEMO_KEY)
  localStorage.removeItem(TAG_KEY)
  localStorage.removeItem(SEQ_KEY)
  localStorage.removeItem(REVIEW_KEY)
  localStorage.removeItem(`${REVIEW_KEY}_logs`)
  cache = null
}

// ---------- 导出 / 导入（含 IndexedDB 图片） ----------

export interface LocalBackup {
  version: number
  exportedAt: string
  memos: LocalMemo[]
  tags: tagType[]
  seq: number
  /** key（不含 idb:// 前缀）→ dataURL */
  images: Record<string, string>
}

export async function exportLocalData(): Promise<LocalBackup> {
  const { memos, tags, seq } = load()
  return {
    version: 1,
    exportedAt: dayjs().format(TIME_FMT),
    memos: JSON.parse(JSON.stringify(memos)) as LocalMemo[],
    tags: JSON.parse(JSON.stringify(tags)) as tagType[],
    seq,
    images: await allImages(),
  }
}

/**
 * 导入备份。
 * - replace：清空现有数据后整体恢复
 * - merge：按 id 去重追加（memo/tag id 已存在的跳过），图片按 key 恢复
 */
export async function importLocalData(
  backup: LocalBackup,
  mode: 'merge' | 'replace' = 'merge',
): Promise<{ memos: number, tags: number, images: number }> {
  if (!backup || backup.version !== 1 || !Array.isArray(backup.memos))
    throw new Error('备份文件格式不正确')

  await restoreImages(backup.images ?? {})

  const state = load()
  let memoCount = 0
  let tagCount = 0

  if (mode === 'replace') {
    state.memos = backup.memos
    state.tags = backup.tags ?? []
    state.seq = backup.seq ?? state.seq
    memoCount = state.memos.length
    tagCount = state.tags.length
  }
  else {
    const memoIds = new Set(state.memos.map(m => m.id))
    for (const memo of backup.memos) {
      if (memoIds.has(memo.id))
        continue
      state.memos.push(memo)
      memoCount++
    }
    const tagIds = new Set(state.tags.map(t => t.id))
    for (const tag of backup.tags ?? []) {
      if (tagIds.has(tag.id))
        continue
      state.tags.push(tag)
      tagCount++
    }
    state.seq = Math.max(state.seq, backup.seq ?? 0)
  }

  persist()
  return { memos: memoCount, tags: tagCount, images: Object.keys(backup.images ?? {}).length }
}

/** 下载 JSON 备份文件 */
export function downloadBackup(backup: LocalBackup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `flomo-local-backup-${dayjs().format('YYYYMMDD-HHmmss')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/** 供外部（如侧边栏）判断是否有待清理的图片引用 */
export { IMAGE_PREFIX, isLocalImage }
