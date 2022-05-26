import { ILoginInfo, ILoginResp, Resp } from "@/types/api";
import axios from "@/utils/request";

export function ApiUserLogin(data: ILoginInfo) {
  return axios<ILoginResp>({
    url: "/api/auth/login",
    method: "post",
    data,
  });
}
export function ApiUserStatistic() {
  return axios<any>({
    url: "/api/statistic/grid",
    method: "get",
  });
}
export function ApiUserInfo() {
  return axios<any>({
    url: "/api/auth/profile",
    method: "get",
  });
}
