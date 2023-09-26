import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { chain, cloneDeep, findIndex, map, orderBy } from 'lodash-es'
import { useUserStore } from './user'
import type { Memo, tagType } from '@/types/memo'
import type { GetListParams } from '@/api/memo'
import {
  ApiDelete as ApiDeleteMemo,
  ApiList as ApiMemoList,
  ApiSave as ApiSaveMemo,
  ApiUpdate as ApiUpdateMemo,
} from '@/api/memo'
import { ApiList as ApiTagList, ApiUpdate as ApiUpdateTag } from '@/api/tag'
import { CardType } from '@/types/card-type'
import { safe2Num } from '@/utils/Tool'
import { getUinx } from '@/utils/time'

interface StateTree {
  articleList: Memo[]
  tagList: tagType[]
  deletedMemoList: Memo[]
  activeTag: string
  searchKeywords: string
}

export const useMemoStore = defineStore('memo', {
  state: (): StateTree => ({
    articleList: [],
    tagList: [],
    deletedMemoList: [],
    activeTag: '',
    searchKeywords: '',
  }),
  actions: {
    loadRemoteData({ ...query }: any = {}) {
      return Promise.all([this.getMemoList({ ...query }), this.getTagList()])
    },
    async loadDeletedMemo() {
      return await ApiMemoList({ deleted: true })
        .then(r => r.data)
        .then((memoList) => {
          this.deletedMemoList = memoList
        })
    },
    async getTagList() {
      const res = await ApiTagList()
      this.tagList = res.data
    },
    async getMemoList(query: Partial<GetListParams>) {
      const res = await ApiMemoList(query)
      this.searchKeywords = query?.content ?? ''
      this.articleList = res.data
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
            images: res.data.images
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
