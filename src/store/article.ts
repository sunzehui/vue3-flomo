import { ElMessage } from "element-plus";
import { Article, tagType } from "./../types/article";
import { defineStore } from "pinia";
import {
  ApiList as ApiArticleList,
  ApiDelete as ApiDeleteArticle,
  ApiTagList,
  ApiSave,
  ApiTagUpdate,
} from "@/api/article";

export const useArticleStore = defineStore("article", {
  state: () => {
    return {
      articleList: [] as Article[],
      tagList: [] as tagType[],
    };
  },
  actions: {
    async resetList() {
      return await Promise.all([this.getArticleList(), this.getTagList()]);
    },
    async getTagList() {
      const res = await ApiTagList();
      this.tagList = res.data;
      return res.data;
    },
    async getArticleList(query?) {
      const res = await ApiArticleList(query);
      this.articleList = res.data;
      return res.data;
    },
    async deleteArticle(id: number) {
      const res = await ApiDeleteArticle(id);
      if (res.code === 0) {
        ElMessage.success("删除成功");
      } else if (res.code === -1) {
        ElMessage.success("删除失败，请稍后再试");
        return false;
      }
      await this.resetList();
      return true;
    },
    async save(data) {
      const res = await ApiSave(data);
      if (res.code === 0) {
        ElMessage.success("保存成功");
      } else if (res.code === -1) {
        ElMessage.success("保存失败，请稍后再试");
      }
      await this.resetList();
      return res;
    },
    async tagRename(oldName: string, newName: string) {
      return await ApiTagUpdate(oldName, { content: newName });
    },
    async setTagTop({ tag, topic: is_topics }) {
      const res = await ApiTagUpdate(tag, { is_topics });
      await this.getTagList();
      return res;
    },
  },

  getters: {},
});
