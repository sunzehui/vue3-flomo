import axios from "@/utils/request";

export function ApiTagList() {
  return axios<any>({
    url: "/api/tag",
    method: "get",
  });
}
