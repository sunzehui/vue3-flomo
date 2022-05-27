import { Article, tagType } from "./../types/article";
import { defineStore } from "pinia";
import { ApiTagList } from "@/api/article";

import { Tag } from "element-plus";

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
  },
  getters: {},
});
