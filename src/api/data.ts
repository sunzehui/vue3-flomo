import request from '@/utils/request'

export interface ExportResult {
  format: 'json' | 'md'
  filename: string
  total: number
  content: string
}

/** 导出全部 memo */
export function ApiExport(format: 'json' | 'md' = 'json') {
  return request<ExportResult>({
    url: '/api/data/export',
    method: 'get',
    params: { format },
  })
}

export interface ImportMemoItem {
  content: string
  tags?: string[]
  createTime?: string
  is_topic?: boolean
}

/** 导入 memo */
export function ApiImport(memos: ImportMemoItem[]) {
  return request<{ total: number, imported: number, skipped: number }>({
    url: '/api/data/import',
    method: 'post',
    data: { memos },
  })
}
