import { Article, tagType } from "./../types/article";
import axios from "@/utils/request";
import { IResponse } from "@/types/api";

export function ApiTagList() {
  return axios<tagType[]>({
    url: "/api/tag",
    method: "get",
  });
}
export function ApiTagUpdate(oldTagName, data: Partial<tagType>) {
  return axios<IResponse>({
    url: "/api/tag/" + oldTagName,
    method: "patch",
    data,
  });
}
export function ApiList(data?) {
  return axios<Article[]>({
    url: "/api/article",
    method: "get",
    params: data,
  });
}
export function ApiDelete(id: number) {
  return axios<IResponse<any>>({
    url: "/api/article/" + id,
    method: "delete",
  });
}

export function ApiSave(data: Partial<Article>) {
  return axios<IResponse<any>>({
    url: "/api/article",
    method: "post",
    data,
  });
}
