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
import { escapeHtml } from '@/utils/editor'
import * as localMemo from '@/utils/localMemo'
import { safe2Num } from '@/utils/Tool'
import { getUinx } from '@/utils/time'

const DEFAULT_PAGE_SIZE = 20

/** 未登录 = 本地模式：数据全部存 localStorage，不发网络请求 */
const isLocalMode = () => !useUserStore().isAuthenticated

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
    /** 拉取第一页并替换列表（未登录时走本地存储，数据不出本机） */
    async getMemoList(query: Partial<GetListParams> = {}) {
      if (isLocalMode()) {
        this.page = 1
        this.query = { ...query }
        const pageData = localMemo.listMemos({ ...query, page: 1, pageSize: this.pageSize })
        this.articleList = pageData.list
        this.total = pageData.total
        this.hasMore = pageData.hasMore
        this.searchKeywords = query?.content ?? ''
        return
      }
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
      if (isLocalMode()) {
        this.isLoading = true
        try {
          const nextPage = this.page + 1
          const pageData = localMemo.listMemos({ ...this.query, page: nextPage, pageSize: this.pageSize })
          const existing = new Set(this.articleList.map(memo => memo.id))
          this.articleList.push(...pageData.list.filter(memo => !existing.has(memo.id)))
          this.page = pageData.page
          this.total = pageData.total
          this.hasMore = pageData.hasMore
        }
        finally {
          this.isLoading = false
        }
        return
      }
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
      if (isLocalMode()) {
        this.deletedMemoList = localMemo.listMemos({ deleted: true, pageSize: 100 }).list
        return
      }
      const res = await ApiMemoList({ deleted: true, pageSize: 100 })
      this.deletedMemoList = res.data.list
    },
    async getTagList() {
      if (isLocalMode()) {
        this.tagList = localMemo.tagList()
        return
      }
      const res = await ApiTagList()
      this.tagList = res.data
    },
    async deleteMemo(id: number) {
      const { refreshUserInfo } = useUserStore()
      if (isLocalMode()) {
        const res = localMemo.deleteMemo(id)
        if (res.code === 0)
          ElMessage.success('删除成功')

        else
          ElMessage.error(res.message || '删除失败，请稍后再试')

        refreshUserInfo()
        this.delArticle(id)
        this.getTagList()
        return
      }
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
      if (isLocalMode()) {
        const res = localMemo.updateMemo(id, { recycle: true })
        if (res.code === 0) {
          ElMessage.success('恢复成功')
          refreshUserInfo()
          this.deletedMemoList = this.deletedMemoList.filter(memo => memo.id !== id)
          return this.loadRemoteData()
        }
        ElMessage.error(res.message || '恢复失败，请稍后再试')
        return
      }
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
      if (isLocalMode()) {
        await localMemo.restoreMemo(id)
        ElMessage.success('恢复成功')
        refreshUserInfo()
        this.deletedMemoList = this.deletedMemoList.filter(memo => memo.id !== id)
        return this.loadRemoteData()
      }
      await ApiRestore(id)
      ElMessage.success('恢复成功')
      refreshUserInfo()
      this.deletedMemoList = this.deletedMemoList.filter(memo => memo.id !== id)
      return this.loadRemoteData()
    },
    /** 批量加/去标签 */
    async batchTag(ids: Array<number | string>, payload: { add?: string[], remove?: string[] }) {
      if (isLocalMode()) {
        localMemo.batchTag({ ids, ...payload })
        ElMessage.success('批量操作成功')
        await this.loadRemoteData(this.query)
        return
      }
      const res = await ApiBatchTag({ ids, ...payload })
      ElMessage.success('批量操作成功')
      await this.loadRemoteData(this.query)
      return res
    },
    async save(data: Partial<Memo>) {
      const { refreshUserInfo } = useUserStore()
      if (isLocalMode()) {
        // 与 ApiSaveMemo 保持一致：入库前转义并包一层 <p>
        const res = localMemo.saveMemo({ ...data, content: `<p>${escapeHtml(data.content)}</p>` } as Partial<Memo>)
        ElMessage.success('保存成功')
        this.getTagList()
        refreshUserInfo()
        this.addArticle(res.data)
        return Promise.resolve(res)
      }
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
        if (isLocalMode()) {
          const res = localMemo.updateMemo(Number(id), data)
          if (res.code !== 0) {
            ElMessage.error(res.message || '保存失败，请稍后再试')
            return Promise.reject(res)
          }
          this.setArticle(id, {
            type: CardType.article,
            content: res.data.content,
            tags: res.data.tags,
            images: res.data.images,
          })
          ElMessage.success('保存成功')
          return Promise.resolve(res)
        }
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
      if (isLocalMode()) {
        const res = localMemo.updateTag(oldName, { content: newName })
        if (res.code !== 0)
          ElMessage.error(res.message)

        else
          await this.getTagList()

        return res
      }
      return await ApiUpdateTag(oldName, { content: newName })
    },
    async setTagTop({ tag, topic: is_topics }) {
      if (isLocalMode()) {
        const res = localMemo.updateTag(tag, { is_topics })
        ElMessage.success('标签置顶成功！')
        await this.loadRemoteData()
        return res
      }
      const res = await ApiUpdateTag(tag, { is_topics })
      ElMessage.success('标签置顶成功！')
      await this.loadRemoteData()
      return res
    },
    /** 设置 / 取消标签的父标签（标签树） */
    async setTagParent(tagContent: string, parentId: number | null) {
      if (isLocalMode()) {
        const res = localMemo.updateTag(tagContent, { parentId })
        ElMessage.success(parentId ? '已归入父标签' : '已移出父标签')
        await this.getTagList()
        return res
      }
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
      if (isLocalMode()) {
        localMemo.updateMemo(Number(articleId), { is_topic: true })
        ElMessage.success('memo置顶成功！')
        this.setArticle(articleId, { is_topic: true })
        return
      }
      const res = await ApiUpdateMemo(articleId, { is_topic: true })
      ElMessage.success('memo置顶成功！')
      this.setArticle(articleId, { is_topic: true })
      return res
    },
    async cancelArticleTop(articleId) {
      if (isLocalMode()) {
        localMemo.updateMemo(Number(articleId), { is_topic: false })
        ElMessage.success('memo取消置顶成功！')
        this.setArticle(articleId, { is_topic: false })
        return
      }
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
