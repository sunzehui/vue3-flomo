/**
 * 本地模式图片存储（IndexedDB）。
 *
 * 免登录模式下图片以 dataURL 形式存入 IndexedDB（容量远大于 localStorage），
 * memo.images 里只保存 `idb://<key>` 引用，渲染时通过 resolveLocalImage 异步解析。
 */
import { reactive } from 'vue'

export const IMAGE_PREFIX = 'idb://'

const DB_NAME = 'flomo-local-images'
const STORE = 'images'

let dbPromise: Promise<IDBDatabase> | null = null

function openDB(): Promise<IDBDatabase> {
  if (dbPromise)
    return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE))
        db.createObjectStore(STORE, { keyPath: 'key' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => {
      dbPromise = null
      reject(req.error)
    }
  })
  return dbPromise
}

async function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest,
): Promise<T> {
  const db = await openDB()
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const req = fn(tx.objectStore(STORE))
    req.onsuccess = () => resolve(req.result as T)
    req.onerror = () => reject(req.error)
  })
}

// ---------- 渲染层：`idb://` 引用 → 可用的 img src ----------

const cache = reactive(new Map<string, string>())
const pending = new Set<string>()

export const isLocalImage = (src?: string) => !!src && src.startsWith(IMAGE_PREFIX)

export const imageKeyOf = (src: string) => src.slice(IMAGE_PREFIX.length)

/** 存入一张图片（dataURL），返回 `idb://<key>` 引用；可指定 key（导入时用） */
export async function putImage(dataUrl: string, key?: string): Promise<string> {
  const k = key ?? `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  await withStore('readwrite', store => store.put({ key: k, dataUrl }))
  cache.set(k, dataUrl)
  return IMAGE_PREFIX + k
}

export async function getImage(src: string): Promise<string | null> {
  const rec = await withStore<{ key: string, dataUrl: string } | undefined>(
    'readonly',
    store => store.get(imageKeyOf(src)),
  )
  return rec?.dataUrl ?? null
}

export async function deleteImage(src: string): Promise<void> {
  await withStore('readwrite', store => store.delete(imageKeyOf(src)))
  cache.delete(imageKeyOf(src))
}

/** 导出用：全部图片 key → dataURL */
export async function allImages(): Promise<Record<string, string>> {
  const list = await withStore<Array<{ key: string, dataUrl: string }>>(
    'readonly',
    store => store.getAll(),
  )
  return Object.fromEntries((list ?? []).map(r => [r.key, r.dataUrl]))
}

/** 导入用：按原 key 批量恢复 */
export async function restoreImages(images: Record<string, string>): Promise<void> {
  for (const [key, dataUrl] of Object.entries(images ?? {}))
    await putImage(dataUrl, key)
}

/**
 * 把图片地址解析为可直接用于 <img :src> 的值。
 * 普通地址原样返回；`idb://` 引用首次访问时异步加载并写入响应式缓存。
 */
export function resolveLocalImage(src?: string): string {
  if (!src)
    return ''
  if (!isLocalImage(src))
    return src
  const key = imageKeyOf(src)
  if (!cache.has(key) && !pending.has(key)) {
    pending.add(key)
    getImage(src)
      .then((url) => {
        cache.set(key, url ?? '')
      })
      .finally(() => {
        pending.delete(key)
      })
  }
  return cache.get(key) ?? ''
}
