import { Article, tagType } from "./../types/article";
import axios from "@/utils/request";
import { IResponse } from "@/types/api";

export function ApiTagList() {
  return axios<tagType[]>({
    url: "/api/tag",
    method: "get",
  });
}
export function ApiArticleList() {
  return axios<Article[]>({
    url: "/api/article",
    method: "get",
  });
}
export function ApiDeleteArticle(id: number) {
  return axios<IResponse<any>>({
    url: "/api/article/" + id,
    method: "delete",
  });
}
