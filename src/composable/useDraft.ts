/**
 * 编辑器草稿：按用户隔离存 localStorage，避免意外刷新丢失内容。
 */

const PREFIX = 'flomo-draft'

export function buildDraftKey(
  userId: number | string | undefined,
  suffix = 'create',
) {
  return `${PREFIX}:${userId ?? 'anon'}:${suffix}`
}

export function readDraft(key: string): string {
  try {
    return localStorage.getItem(key) ?? ''
  }
  catch {
    return ''
  }
}

export function saveDraft(key: string, content: string) {
  try {
    if (content && content.trim())
      localStorage.setItem(key, content)
    else
      localStorage.removeItem(key)
  }
  catch {
    // localStorage 不可用（隐私模式等）时静默失败
  }
}

export function clearDraft(key: string) {
  try {
    localStorage.removeItem(key)
  }
  catch {
    // ignore
  }
}
