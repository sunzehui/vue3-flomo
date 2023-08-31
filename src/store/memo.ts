import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { cloneDeep, findIndex, map, orderBy, reverse } from 'lodash-es'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useUserStore } from './user'
import type { Memo, tagType } from '@/types/memo'
import {
  ApiList as ApiArticleList,
  ApiDelete as ApiDeleteArticle,
  ApiSave,
  ApiUpdate,
  ApiUpdate as ApiUpdateArticle,
} from '@/api/article'
import { ApiList as ApiTagList, ApiUpdate as ApiUpdateTag } from '@/api/tag'
import { CardType } from '@/types/card-type'
import { safe2Num } from '@/utils/Tool'

dayjs.extend(utc)
dayjs.extend(relativeTime)
interface StateTree {
  articleList: Memo[]
  tagList: tagType[]
  deletedMemoList: Memo[]
  activeTag: string
}

export const useMemoStore = defineStore('memo', {
  state: (): StateTree => ({
    articleList: [],
    tagList: [],
    deletedMemoList: [],
    activeTag: '',
  }),
  actions: {
    loadRemoteData({ ...query }: any = {}) {
      return Promise.all([this.getArticleList({ ...query }), this.getTagList()])
    },
    async loadDeletedMemo() {
      return await ApiArticleList({ deleted: true })
        .then(r => r.data)
        .then((memoList) => {
          this.deletedMemoList = memoList
        })
    },
    async getTagList() {
      const res = await ApiTagList()
      this.tagList = res.data
    },
    async getArticleList(query = { tag: '', deleted: false }) {
      const res = await ApiArticleList({ ...query })
      this.articleList = res.data
    },
    async deleteMemo(id: number) {
      const { refreshUserInfo } = useUserStore()
      const res = await ApiDeleteArticle(id)
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
      const res = await ApiUpdateArticle(id, {
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
      const res = await ApiSave(data)
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
        const res = await ApiUpdate(id, data)
        if (res.code === 0) {
          this.setArticle(id, {
            type: CardType.article,
            content: data.content,
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
      const res = await ApiUpdateArticle(articleId, { is_topic: true })
      ElMessage.success('memo置顶成功！')
      this.setArticle(articleId, { is_topic: true })
      return res
    },
    async cancelArticleTop(articleId) {
      const res = await ApiUpdateArticle(articleId, { is_topic: false })
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
    // 增强：支持排序，置顶
    enhancedMemoList(state) {
      // this.
      const list = state.articleList
      const sortedListByTime = reverse(
        orderBy(list, (obj) => {
          if (obj.is_topic)
            return Number.MAX_SAFE_INTEGER
          const createTime = safe2Num(dayjs(obj.createTime).unix())
          return createTime ?? Number(obj.id)
        }),
      )
      const cardStateWarpper = (obj: Memo & { type: CardType }, idx, arr) => {
        const type = obj.type ?? CardType.article
        const isLast = arr.length - 1 === idx
        return { ...obj, type, isLast }
      }
      return map(
        sortedListByTime, cardStateWarpper,
      )
    },
  },
})
