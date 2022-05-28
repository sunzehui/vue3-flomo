import { ElMessage } from "element-plus";
import { Article, tagType } from "./../types/article";
import { defineStore } from "pinia";
import { ApiArticleList, ApiDeleteArticle, ApiTagList } from "@/api/article";

export const useArticleStore = defineStore("article", {
  state: () => {
    return {
      articleList: [] as Article[],
      tagList: [] as tagType[],
    };
  },
  actions: {
    getTagList() {
      ApiTagList().then((res) => {
        this.tagList = res.data;
        console.log("tag", this.tagList);
        console.log(res.data);
      });
    },
    getArticleList() {
      ApiArticleList().then((res) => {
        this.articleList = res.data;
      });
    },
    deleteArticle(id: number) {
      ApiDeleteArticle(id).then((res) => {
        if (res.code === 0) {
          ElMessage.success("删除成功");
          this.getArticleList();
        } else if (res.code === -1) {
          ElMessage.success("删除失败，请稍后再试");
        }
      });
    },
  },

  getters: {},
});
