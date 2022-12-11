import { ElMessage } from "element-plus";
import { Article, tagType } from "./../types/article";
import { defineStore } from "pinia";
import {
  ApiList as ApiArticleList,
  ApiDelete as ApiDeleteArticle,
  ApiUpdate as ApiUpdateArticle,
  ApiSave,
  ApiUpdate,
} from "@/api/article";

import { ApiList as ApiTagList, ApiUpdate as ApiUpdateTag } from "@/api/tag";
import { cloneDeep, findIndex, map, orderBy, reverse, sortBy } from "lodash-es";
import { CardType } from "@/types/card-type";
import { safeNaN } from "@/utils/Tool";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(utc);
dayjs.extend(relativeTime);
export const useArticleStore = defineStore("article", {
  state: () => {
    return {
      articleList: [] as Article[],
      tagList: [] as tagType[],
      activeTag: "",
    };
  },
  actions: {
    resetList() {
      return Promise.all([this.getArticleList(), this.getTagList()]);
    },
    getTagList() {
      return ApiTagList().then((res) => {
        this.tagList = res.data;
      });
    },
    getArticleList({ tag } = { tag: "" }) {
      return ApiArticleList({ tag }).then((res) => {
        this.articleList = res.data;
      });
    },
    deleteArticle(id: number) {
      ApiDeleteArticle(id).then((res) => {
        if (res.code === 0) {
          ElMessage.success("删除成功");
        } else if (res.code === -1) {
          ElMessage.success("删除失败，请稍后再试");
        }
        this.resetList();
      });
    },
    save(data) {
      return ApiSave(data).then((res) => {
        if (res.code === 0) {
          ElMessage.success("保存成功");
        } else if (res.code === -1) {
          ElMessage.success("保存失败，请稍后再试");
        }
        this.resetList();
        return Promise.resolve(res);
      });
    },
    update(id, data) {
      return ApiUpdate(id, data).then((res) => {
        if (res.code === 0) {
          ElMessage.success("保存成功");
        } else if (res.code === -1) {
          ElMessage.success("保存失败，请稍后再试");
        }
        this.resetList();
        return Promise.resolve(res);
      });
    },
    async tagRename(oldName: string, newName: string) {
      return await ApiUpdateTag(oldName, { content: newName });
    },
    async setTagTop({ tag, topic: is_topics }) {
      const res = await ApiUpdateTag(tag, { is_topics });
      ElMessage.success("标签置顶成功！");
      await this.resetList();
      return res;
    },
    async setArticleTop(articleId) {
      const res = await ApiUpdateArticle(articleId, { is_topic: true });
      ElMessage.success("memo置顶成功！");
      await this.resetList();
      return res;
    },
    async cancelArticleTop(articleId) {
      const res = await ApiUpdateArticle(articleId, { is_topic: false });
      ElMessage.success("memo取消置顶成功！");
      await this.resetList();
      return res;
    },
    setArticleType(articleId, type) {
      const list = cloneDeep(this.articleList);
      const idx = findIndex(list, (o: Article) => o.id == articleId);
      list[idx].type = type;
      this.articleList = list;
      console.log(list[idx]);
    },
    setActiveTag(tag: string) {
      this.activeTag = tag;
    },
  },

  getters: {
    articleListEnhance(state) {
      const list = state.articleList;
      return map(
        reverse(
          orderBy(list, (obj) => {
            if (obj.is_topic) return Number.MAX_SAFE_INTEGER;
            const createTime = safeNaN(dayjs(obj.createTime).unix());
            return createTime ?? Number(obj.id);
          })
        ),
        (obj: Article & { type: CardType }, idx, arr) => {
          const type = obj.type ?? CardType.article;
          const isLast = arr.length - 1 === idx;
          return { ...obj, type, isLast };
        }
      );
    },
  },
});
