import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { cloneDeep, findIndex, orderBy } from 'lodash-es'
import { useUserStore } from './user'
import type { Memo, tagType } from '@/types/memo'
import type { GetListParams } from '@/api/memo'
import {
  ApiBatchTag,
  ApiDelete as ApiDeleteMemo,
  ApiList as ApiMemoList,
  ApiRestore,
  ApiSave as ApiSaveMemo,
  ApiUpdate as ApiUpdateMemo,
} from '@/api/memo'
import { ApiList as ApiTagList, ApiUpdate as ApiUpdateTag } from '@/api/tag'
import { CardType } from '@/types/card-type'
import { safe2Num } from '@/utils/Tool'
import { getUinx } from '@/utils/time'

const DEFAULT_PAGE_SIZE = 20

interface StateTree {
  articleList: Memo[]
  tagList: tagType[]
  deletedMemoList: Memo[]
  activeTag: string
  searchKeywords: string
  page: number
  pageSize: number
  total: number
  hasMore: boolean
  isLoading: boolean
  query: Partial<GetListParams>
  /** 批量操作模式 */
  isBatchMode: boolean
  /** 批量模式下被选中的 memo id */
  selectedIds: Array<number | string>
}

export const useMemoStore = defineStore('memo', {
  state: (): StateTree => ({
    articleList: [],
    tagList: [],
    deletedMemoList: [],
    activeTag: '',
    searchKeywords: '',
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    hasMore: false,
    isLoading: false,
    query: {},
    isBatchMode: false,
    selectedIds: [],
  }),
  actions: {
    loadRemoteData(query: any = {}) {
      return Promise.all([this.getMemoList({ ...query }), this.getTagList()])
    },
    /** 拉取第一页并替换列表 */
    async getMemoList(query: Partial<GetListParams> = {}) {
      this.page = 1
      this.query = { ...query }
      this.isLoading = true
      try {
        const res = await ApiMemoList({
          ...query,
          page: 1,
          pageSize: this.pageSize,
        })
        const pageData = res.data
        this.articleList = pageData.list
        this.total = pageData.total
        this.hasMore = pageData.hasMore
        this.searchKeywords = query?.content ?? ''
      }
      finally {
        this.isLoading = false
      }
    },
    /** 滚动到底部时加载下一页 */
    async loadMore() {
      if (this.isLoading || !this.hasMore)
        return
      this.isLoading = true
      try {
        const nextPage = this.page + 1
        const res = await ApiMemoList({
          ...this.query,
          page: nextPage,
          pageSize: this.pageSize,
        })
        const pageData = res.data
        const existing = new Set(this.articleList.map(memo => memo.id))
        this.articleList.push(
          ...pageData.list.filter(memo => !existing.has(memo.id)),
        )
        this.page = pageData.page
        this.total = pageData.total
        this.hasMore = pageData.hasMore
      }
      finally {
        this.isLoading = false
      }
    },
    async loadDeletedMemo() {
      const res = await ApiMemoList({ deleted: true, pageSize: 100 })
      this.deletedMemoList = res.data.list
    },
    async getTagList() {
      const res = await ApiTagList()
      this.tagList = res.data
    },
    async deleteMemo(id: number) {
      const { refreshUserInfo } = useUserStore()
      const res = await ApiDeleteMemo(id)
      if (res.code === 0)
        ElMessage.success('删除成功')

      else if (res.code === -1)
        ElMessage.success('删除失败，请稍后再试')

      refreshUserInfo()
      this.delArticle(id)
      this.getTagList()
    },
    async recycleMemo(id: number) {
      const { refreshUserInfo } = useUserStore()
      const res = await ApiUpdateMemo(id, {
        recycle: true,
      })
      if (res.code === 0)
        ElMessage.success('恢复成功')

      else if (res.code === -1)
        ElMessage.success('恢复失败，请稍后再试')

      refreshUserInfo()
      this.deletedMemoList = this.deletedMemoList.filter(memo => memo.id !== id)
      this.loadRemoteData()
    },
    /** 回收站恢复（显式接口） */
    async restoreMemo(id: number) {
      const { refreshUserInfo } = useUserStore()
      await ApiRestore(id)
      ElMessage.success('恢复成功')
      refreshUserInfo()
      this.deletedMemoList = this.deletedMemoList.filter(memo => memo.id !== id)
      return this.loadRemoteData()
    },
    /** 批量加/去标签 */
    async batchTag(ids: Array<number | string>, payload: { add?: string[], remove?: string[] }) {
      const res = await ApiBatchTag({ ids, ...payload })
      ElMessage.success('批量操作成功')
      await this.loadRemoteData(this.query)
      return res
    },
    async save(data: Partial<Memo>) {
      const { refreshUserInfo } = useUserStore()
      const res = await ApiSaveMemo(data)
      if (res.code === 0) {
        ElMessage.success('保存成功')
        this.getTagList()
        refreshUserInfo()
        this.addArticle(res.data)
        return Promise.resolve(res)
      }
      else if (res.code === -1) {
        ElMessage.success('保存失败，请稍后再试')
        return Promise.reject(res)
      }
      else {
        return Promise.reject(res)
      }
    },
    async update(id: Memo['id'], data: Partial<Memo>) {
      try {
        const res = await ApiUpdateMemo(id, data)
        if (res.code === 0) {
          this.setArticle(id, {
            type: CardType.article,
            content: res.data.content,
            tags: res.data.tags,
            images: res.data.images,
          })

          ElMessage.success('保存成功')
          return Promise.resolve(res)
        }
        else if (res.code === -1) {
          ElMessage.success('保存失败，请稍后再试')
          return Promise.reject(res)
        }

        return Promise.reject(res)
      }
      catch (err) {
        return Promise.reject(err)
      }
    },
    async tagRename(oldName: string, newName: string) {
      return await ApiUpdateTag(oldName, { content: newName })
    },
    async setTagTop({ tag, topic: is_topics }) {
      const res = await ApiUpdateTag(tag, { is_topics })
      ElMessage.success('标签置顶成功！')
      await this.loadRemoteData()
      return res
    },
    /** 设置 / 取消标签的父标签（标签树） */
    async setTagParent(tagContent: string, parentId: number | null) {
      const res = await ApiUpdateTag(tagContent, { parentId })
      ElMessage.success(parentId ? '已归入父标签' : '已移出父标签')
      await this.getTagList()
      return res
    },
    /** 进入 / 退出批量操作模式 */
    toggleBatchMode(enabled?: boolean) {
      this.isBatchMode = enabled ?? !this.isBatchMode
      if (!this.isBatchMode)
        this.selectedIds = []
    },
    /** 勾选 / 取消勾选一条 memo */
    toggleSelect(id: number | string) {
      const key = String(id)
      const idx = this.selectedIds.findIndex(item => String(item) === key)
      if (idx >= 0)
        this.selectedIds.splice(idx, 1)
      else
        this.selectedIds.push(id)
    },
    /** 判断某条 memo 是否被选中 */
    isSelected(id: number | string) {
      return this.selectedIds.some(item => String(item) === String(id))
    },
    /** 全选当前列表 */
    selectAll(ids: Array<number | string>) {
      this.selectedIds = [...ids]
    },
    /** 清空选择 */
    clearSelection() {
      this.selectedIds = []
    },
    async setArticleTop(articleId) {
      const res = await ApiUpdateMemo(articleId, { is_topic: true })
      ElMessage.success('memo置顶成功！')
      this.setArticle(articleId, { is_topic: true })
      return res
    },
    async cancelArticleTop(articleId) {
      const res = await ApiUpdateMemo(articleId, { is_topic: false })
      ElMessage.success('memo取消置顶成功！')
      this.setArticle(articleId, { is_topic: false })
      return res
    },
    findIndex(articleId: Memo['id']) {
      const list = cloneDeep(this.articleList)
      const idx = findIndex(list, (o: Memo) => o.id.toString() === articleId.toString())
      return idx
    },
    setArticle(articleId: Memo['id'], data: Partial<Memo & { type: CardType }>) {
      const list = this.articleList
      const idx = this.findIndex(articleId)
      Object.assign(list[idx], data)
    },
    delArticle(articleId: Memo['id']) {
      const idx = this.findIndex(articleId)
      this.articleList.splice(idx, 1)
    },
    addArticle(article: Memo) {
      this.articleList.unshift(article)
    },
    setActiveTag(tag: string) {
      this.activeTag = tag
    },
  },
  getters: {
    selectedCount(state) {
      return state.selectedIds.length
    },
    // 增强：支持排序，置顶，查询高亮
    enhancedMemoList(state) {
      const list = state.articleList
      const sortedListByTime = orderBy(list, (obj) => {
        if (obj.is_topic)
          return Number.MIN_SAFE_INTEGER
        const createTime = safe2Num(getUinx(obj.createTime))
        return -createTime ?? -Number(obj.id)
      })

      const cardStateWrapper = (obj: Memo & { type: CardType }, idx, arr) => {
        const type = obj.type ?? CardType.article
        const isLast = arr.length - 1 === idx
        return { ...obj, type, isLast }
      }

      return sortedListByTime.map(cardStateWrapper)
    },
  },
})
