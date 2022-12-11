import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import type { Article, tagType } from '@/types/article'
import {
  ApiList as ApiArticleList,
  ApiDelete as ApiDeleteArticle,
  ApiSave,
  ApiTagList,
  ApiTagUpdate,
} from '@/api/article'

export const useArticleStore = defineStore('article', {
  state: () => {
    return {
      articleList: [] as Article[],
      tagList: [] as tagType[],
    }
  },
  actions: {
    resetList() {
      Promise.all([this.getArticleList(), this.getTagList()])
    },
    getTagList() {
      ApiTagList().then((res) => {
        this.tagList = res.data
      })
    },
    getArticleList({ tag } = { tag: '' }) {
      ApiArticleList({ tag }).then((res) => {
        this.articleList = res.data
      })
    },
    deleteArticle(id: number) {
      ApiDeleteArticle(id).then((res) => {
        if (res.code === 0)
          ElMessage.success('删除成功')
        else if (res.code === -1)
          ElMessage.success('删除失败，请稍后再试')

        this.resetList()
      })
    },
    save(data) {
      return ApiSave(data).then((res) => {
        if (res.code === 0)
          ElMessage.success('保存成功')
        else if (res.code === -1)
          ElMessage.success('保存失败，请稍后再试')

        return Promise.resolve(res)
      })
    },
    async tagRename(oldName: string, newName: string) {
      return await ApiTagUpdate(oldName, { content: newName })
    },
    async setTagTop({ tag, topic: is_topics }) {
      const res = await ApiTagUpdate(tag, { is_topics })
      await this.getTagList()
      return res
    },
  },

  getters: {},
})
