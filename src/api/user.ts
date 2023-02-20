import { ILoginInfo, ILoginResp, Resp } from "@/types/api";
import { IUserProfile } from "@/types/user";
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
  return axios<IUserProfile>({
    url: "/api/user/profile",
    method: "get",
  });
}
export function ApiUserRegister(data) {
  return axios<{
    status: true;
    message: "ok";
  }>({
    url: "/api/user/register",
    method: "post",
    data,
  });
}
